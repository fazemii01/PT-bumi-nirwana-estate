import os
import time
import asyncio
from threading import Event

import pandas as pd
import socketio
from dotenv import load_dotenv

from sklearn.metrics.pairwise import cosine_similarity
# from langchain_community.embeddings import OllamaEmbeddings
from langchain_ollama import OllamaEmbeddings
# from datasets import load_metric
import evaluate


load_dotenv()

SOCKETIO_URL = "http://localhost:4500"
CHAT_EVENT_EMIT = "message"
CHAT_EVENT_RECEIVE = "response"
CHAT_CLEAR_HISTORY = "clear history"
TIMEOUT_SECONDS = 1000

sio = socketio.Client()
response_data = None
response_event = Event()


embed_model = OllamaEmbeddings(
    model="mxbai-embed-large",
    base_url="http://localhost:4600"
)


# rouge = load_metric("rouge")
# bertscore = load_metric("bertscore")
rouge = evaluate.load("rouge")
bertscore = evaluate.load("bertscore")

USE_BERTSCORE_FOR_FAITHFULNESS = True


@sio.event
def connect():
    print("Socket.IO client connected!")

@sio.event
def connect_error(data):
    print(f"Connection failed: {data}")

@sio.event
def disconnect():
    print("Socket.IO client disconnected.")

@sio.on(CHAT_EVENT_RECEIVE)
def on_message(data):
    global response_data
    print(f" Received answer: {data}")
    response_data = data
    response_event.set()


def evaluate_live_chatbot(eval_df: pd.DataFrame) -> pd.DataFrame:
    """Ask chatbot and collect answers."""
    results = []
    try:
        sio.connect(SOCKETIO_URL, transports=['websocket'])
    except socketio.exceptions.ConnectionError as e:
        print(f"Could not connect to server. Error: {e}")
        return pd.DataFrame()

    for index, row in eval_df.iterrows():
        response_event.clear()
        global response_data
        response_data = None

        if not sio.connected:
            print("Client disconnected, attempting to reconnect...")
            try:
                sio.connect(SOCKETIO_URL, transports=['websocket'])
            except socketio.exceptions.ConnectionError:
                results.append({
                    "question": row["question"],
                    "ground_truth_answer": row["ground_truth_answer"],
                    "generated_answer": "RECONNECT_FAILED"
                })
                continue

        sio.emit(CHAT_CLEAR_HISTORY)
        time.sleep(0.5)

        question = row['question']
        ground_truth = row['ground_truth_answer']
        print(f"\nSending question #{index + 1}: {question}")
        sio.emit(CHAT_EVENT_EMIT, question)

        event_was_set = response_event.wait(timeout=TIMEOUT_SECONDS)

        if not event_was_set:
            generated_answer = "TIMEOUT_ERROR"
        else:
            generated_answer = response_data or "EMPTY_RESPONSE"

        results.append({
            "question": question,
            "ground_truth_answer": ground_truth,
            "generated_answer": generated_answer,
        })
        print(f" Finished evaluation for question #{index + 1}")

    sio.disconnect()
    return pd.DataFrame(results)


def cosine_sim(a, b):
    """Cosine similarity between 2 texts using Ollama embeddings."""
    a_emb = embed_model.embed_query(a)
    b_emb = embed_model.embed_query(b)
    return float(cosine_similarity([a_emb], [b_emb])[0][0])


def evaluate_with_simple_metrics(results_df: pd.DataFrame) -> pd.DataFrame:
    """Evaluation using embeddings + classical metrics (no ragas)."""
    if results_df.empty:
        print("Empty DataFrame, skipping evaluation.")
        return results_df

    metrics = {
        "faithfulness": [],
        "answer_relevancy": [],
        "context_precision": [],
        "context_recall": []
    }

    for _, row in results_df.iterrows():
        q = str(row["question"])
        a = str(row["generated_answer"])
        gt = str(row["ground_truth_answer"])
        if USE_BERTSCORE_FOR_FAITHFULNESS:
            bert = bertscore.compute(
                predictions=[a],
                references=[gt],
                model_type="bert-base-multilingual-cased"
            )
            faith = float(bert["precision"][0])
        else:
            faith = cosine_sim(a, gt)
        ans_rel = cosine_sim(a, q)
        ctx_prec = cosine_sim(a, gt)
        rouge_res = rouge.compute(predictions=[a], references=[gt], rouge_types=["rougeL"])

       
        if "rougeL" in rouge_res and isinstance(rouge_res["rougeL"], dict):
            ctx_recall = float(rouge_res["rougeL"]["recall"])
        elif "rougeL" in rouge_res and not isinstance(rouge_res["rougeL"], dict):
            ctx_recall = float(rouge_res["rougeL"])
        elif "rougeL_recall" in rouge_res:  
            ctx_recall = float(rouge_res["rougeL_recall"])
        else:
            ctx_recall = 0.0  

        # --- Append results ---
        metrics["faithfulness"].append(faith)
        metrics["answer_relevancy"].append(ans_rel)
        metrics["context_precision"].append(ctx_prec)
        metrics["context_recall"].append(ctx_recall)

    for k, v in metrics.items():
        results_df[k] = v
        
    results_df = results_df.round(2)

    return results_df



def save_to_excel(df: pd.DataFrame, filename="eval_scores.xlsx"):
    """Save nicely formatted Excel file."""
    with pd.ExcelWriter(filename, engine="xlsxwriter") as writer:
        df.to_excel(writer, sheet_name="Scores", index=False)
        workbook = writer.book
        worksheet = writer.sheets["Scores"]

        score_columns = ["context_precision", "context_recall", "faithfulness", "answer_relevancy"]
        for col_num, col_name in enumerate(df.columns):
            if col_name in score_columns:
                worksheet.conditional_format(
                    1, col_num, len(df), col_num,
                    {
                        'type': '3_color_scale',
                        'min_color': "#F8696B",
                        'mid_color': "#FFEB84",
                        'max_color': "#63BE7B",
                    }
                )

        for i, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.set_column(i, i, max_len)

    print(f"\n Results saved to {filename}")


if __name__ == "__main__":

    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

        test_data = {
            "question": [
            "Siapa nama pengembang perumahan ini dan apa entitas legal proyeknya?",
            "Di mana saja lokasi utama proyek perumahan yang Anda kembangkan di Lumajang?",
            "Saya ingin datang langsung ke kantor, di mana alamat kantor pemasarannya?",
            "Berapa harga rumah subsidi di The Margojoyo Residence dan berapa DP-nya?",
            "Berapa simulasi angsuran KPR per bulan untuk rumah subsidi di Margojoyo dengan tenor 15 tahun?",
            "Apa saja spesifikasi rumah subsidi Tipe 30/72 di Margojoyo?",
            "Selain rumah, apakah ada properti lain yang dijual di The Margojoyo Residence?",
            "Saya seorang milenial dengan gaji UMR dan kesulitan menabung untuk DP. Apakah ada solusi perumahan untuk saya?",
            "Berapa harga rumah di Bumi Nirwana Sumberejo dan apa saja promonya?",
            "Apa saja ruangan yang ada di dalam rumah di Bumi Nirwana Sumberejo?",
            "Apa konsep yang diusung oleh perumahan The Royal Avenue?",
            "Apa fasilitas paling unggul yang ditawarkan di setiap unit The Royal Avenue?",
            "Berapa harga satu unit rumah di The Royal Avenue dan ada promo apa?",
            "Apa yang dimaksud dengan Uang Tanda Jadi (UTJ) dan apakah bisa dikembalikan jika saya batal membeli?",
            "Bagaimana jika pengajuan KPR saya ditolak oleh bank, apakah Uang Muka (DP) saya bisa kembali?",
            "Apa saja biaya yang sudah termasuk dalam harga jual rumah?",
            "Dokumen apa saja yang umumnya diperlukan untuk mengajukan KPR?",
            "Apakah ada dokumen tambahan yang dibutuhkan jika saya seorang PNS atau wiraswasta?",
            "Saya sudah bosan mengontrak rumah setiap tahun, apa solusi yang ditawarkan?",
            "Saya khawatir proses KPR itu rumit. Apakah tim Anda bisa membantu saya?"
        ],
        "ground_truth_answer": [
            "Nama pengembangnya adalah PT Bumi Nirwana Estate dan entitas legal proyeknya adalah PT. Margojoyo Anugrah Persada.",
            "Proyek kami berlokasi di tiga area kunci: Klampokarum (Kecamatan Tekung), Sumberejo (Kecamatan Sukodono), dan di pusat kota di Ditotrunana.",
            "Kantor pemasaran kami beralamat di Jalan Achmad Yani No. 172, Lumajang. Anda juga bisa menghubungi kami di nomor 081999998000.",
            "Harga jual rumah subsidi di The Margojoyo Residence adalah Rp 166.000.000 dengan Uang Muka (DP) sebesar 1% atau Rp 1.660.000.",
            "Untuk tenor 15 tahun, simulasi angsuran KPR per bulannya adalah Rp 1.299.000.",
            "Spesifikasinya mencakup 2 kamar tidur, 1 kamar mandi, carport, dapur, area taman, daya listrik 900 Watt, dan sumber air dari sumur bor.",
            "Ya, kami juga menyediakan Ruko (Rumah Toko) 2 Lantai dengan harga Rp 250.000.000.",
            "Tentu ada. Perumahan Bumi Nirwana Sumberejo dirancang khusus untuk milenial atau masyarakat dengan gaji UMR dan menawarkan promo utama Tanpa DP (DP 0%).",
            "Harga rumah Tipe 30/60 di sana adalah Rp 166.000.000. Promonya adalah Tanpa DP (DP 0%) dan Gratis Semua Biaya.",
            "Rumah di Bumi Nirwana Sumberejo memiliki 2 kamar tidur, 1 kamar mandi, carport, dan sebuah ruang serbaguna.",
            "The Royal Avenue adalah perumahan komersil premium yang berlokasi di jantung kota Lumajang dengan konsep hunian mewah 2 lantai berdesain modern dan elegan.",
            "Fasilitas unggulan di The Royal Avenue adalah setiap rumah dilengkapi dengan kolam renang pribadi.",
            "Harga per unitnya adalah Rp 300.000.000 dengan promo spesial \"Gratis Semua Biaya\".",
            "UTJ adalah biaya untuk mengamankan unit pilihan Anda. Biaya ini tidak dapat dikembalikan (hangus) jika terjadi pembatalan sepihak dari konsumen.",
            "Ya, Uang Muka (DP) dapat dikembalikan jika pengajuan KPR Anda ditolak oleh bank karena masalah BI Checking.",
            "Harga jual sudah termasuk biaya perizinan IMB/PBG, instalasi listrik, dan sumber air dari sumur pasak.",
            "Persyaratan dokumen umum meliputi fotokopi KTP, KK, NPWP, Pas Foto, Surat Nikah (jika sudah menikah), Slip Gaji 3 bulan terakhir, dan Surat Keterangan Kerja.",
            "Ya. Untuk PNS, wajib melampirkan SK Terakhir. Untuk wiraswasta, wajib melampirkan SIUP/TDP atau SKU.",
            "Kami menawarkan solusi memiliki rumah sendiri untuk mendapatkan ketenangan dan stabilitas. Anda bisa mempertimbangkan rumah subsidi kami yang angsurannya seringkali lebih ringan dari biaya sewa.",
            "Tentu saja. Anda tidak perlu khawatir, karena tim kami siap membantu Anda di setiap langkahnya, mulai dari awal proses hingga serah terima kunci."
        ]
    }

    eval_df = pd.DataFrame(test_data)

    print("\n--- Running Live Chatbot Evaluation ---")
    results_df = evaluate_live_chatbot(eval_df)

    if not results_df.empty:
        results_df.to_csv("results_only.csv", index=False)
        print("\nRaw chatbot results:")
        print(results_df.head())

        final_df = evaluate_with_simple_metrics(results_df)
        final_df.to_csv("eval_results.csv", index=False)
        save_to_excel(final_df)

        print("\n Evaluation complete! Check 'eval_scores.xlsx' and 'eval_results.csv'")
    else:
        print("Live evaluation did not produce any results. Halting.")
