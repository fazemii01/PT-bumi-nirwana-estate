import os
import time
import asyncio
from threading import Event

import pandas as pd
import socketio
from dotenv import load_dotenv

from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
)
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

SOCKETIO_URL = "http://localhost:4500"
CHAT_EVENT_EMIT = "message"
CHAT_EVENT_RECEIVE = "response"
CHAT_CLEAR_HISTORY = "clear history"
TIMEOUT_SECONDS = 1000

try:
    print("--- Connecting to local LLM (Ollama) ---")
    eval_llm = ChatOllama(
        model="qwen2:1.5b",
        base_url="http://localhost:4600"
    )
    print("LLM connection test:", eval_llm.invoke("HALLO").content)
    print("--- LLM connection successful ---")
except Exception as e:
    print(f"FAILED to connect to Ollama. Please ensure it's running. Error: {e}")
    eval_llm = None

sio = socketio.Client()
response_data = None
response_event = Event()

# parser = JsonOutputParser()

# prompt = ChatPromptTemplate.from_messages([
#     ("system", "You are an evaluator. Return JSON ONLY."),
#     ("human", "{input}")
# ])
# eval_llm = prompt | eval_llm | parser

@sio.event
def connect():
    """Handles successful connection to the Socket.IO server."""
    print("Socket.IO client connected!")

@sio.event
def connect_error(data):
    """Handles connection errors."""
    print(f"Connection failed: {data}")

@sio.event
def disconnect():
    """Handles disconnection from the Socket.IO server."""
    print("Socket.IO client disconnected.")

@sio.on(CHAT_EVENT_RECEIVE)
def on_message(data):
    """
    Handles incoming messages from the server on the specified event.
    """
    global response_data
    print(f" Received answer: {data}")
    response_data = data
    response_event.set()

def evaluate_live_chatbot(eval_df: pd.DataFrame) -> pd.DataFrame:
    """
    Interacts with the live chatbot to get generated answers for each question.
    """
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


# def evaluate_with_ragas(results_df: pd.DataFrame, llm_instance) -> pd.DataFrame:
#     """
#     Evaluates chatbot results using Ragas in a single, efficient batch.
#     """
#     if results_df.empty or llm_instance is None:
#         print("DataFrame is empty or LLM is not available. Skipping RAGAS evaluation.")
#         return results_df

#     print("\n--- Preparing data for RAGAS batch evaluation ---")
#     dataset_dict = {
#         "question": results_df["question"].fillna("").tolist(),
#         "answer": results_df["generated_answer"].fillna("").tolist(),
#         "contexts": [[ctx] for ctx in results_df["ground_truth_answer"].fillna("").tolist()],
#         "ground_truth": results_df["ground_truth_answer"].fillna("").tolist(),
#     }

#     ragas_dataset = Dataset.from_dict(dataset_dict)
#     embeddings = OllamaEmbeddings(model="mxbai-embed-large", base_url="http://localhost:4600")

#     print(f" Evaluating all {len(results_df)} items in a single batch...")
    
#     scores = evaluate(
#         ragas_dataset,
#         metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
#         llm=llm_instance,
#         embeddings=embeddings,
#         raise_exceptions=False,
#     )

#     print("--- RAGAS batch evaluation complete ---")
#     scores_df = scores.to_pandas()

#     cols_to_drop = ['question', 'answer', 'contexts', 'ground_truth']
#     scores_df = scores_df.drop(columns=cols_to_drop, errors='ignore')

#     final_df = pd.concat([results_df.reset_index(drop=True), scores_df], axis=1)
#     return final_df

def evaluate_with_ragas(results_df: pd.DataFrame, llm_instance, batch_size=3, delay=1) -> pd.DataFrame:
    """
    Begin eval
    """
    if results_df.empty or llm_instance is None:
        print("DataFrame is empty or LLM is not available. Skipping RAGAS evaluation.")
        return results_df

    print("\n--- Preparing data for RAGAS batched evaluation ---")

    embeddings = OllamaEmbeddings(model="mxbai-embed-large", base_url="http://localhost:4600")

    all_scores = []

    for i in range(0, len(results_df), batch_size):
        batch_df = results_df.iloc[i:i+batch_size]

        dataset_dict = {
            "question": batch_df["question"].fillna("").tolist(),
            "answer": batch_df["generated_answer"].fillna("").tolist(),
            "contexts": [[ctx] for ctx in batch_df["ground_truth_answer"].fillna("").tolist()],
            "ground_truth": batch_df["ground_truth_answer"].fillna("").tolist(),
        }


        ragas_dataset = Dataset.from_dict(dataset_dict)

        print(f"\n Evaluating batch {i//batch_size+1} ({len(batch_df)} items)...")

        try:
            scores = evaluate(
                ragas_dataset,
                metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
                llm=llm_instance,
                embeddings=embeddings,
                raise_exceptions=False,
                # strict=False
            )
            scores_df = scores.to_pandas()
            scores_df = scores_df.drop(columns=['question', 'answer', 'contexts', 'ground_truth'], errors='ignore')

            merged_batch = pd.concat([batch_df.reset_index(drop=True), scores_df], axis=1)
            all_scores.append(merged_batch)

            temp_df = pd.concat(all_scores, ignore_index=True)
            temp_df.to_csv("ragas_results_partial.csv", index=False)
            print(f"✔️ Batch {i//batch_size+1} done. Progress saved to ragas_results_partial.csv")

        except Exception as e:
            print(f"Error in batch {i//batch_size+1}: {e}")

        time.sleep(delay) 

    final_df = pd.concat(all_scores, ignore_index=True)
    return final_df


def save_to_excel(df: pd.DataFrame, filename="ragas_scores.xlsx"):
    """
    Saves the final DataFrame to a formatted Excel file.
    """
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

    if eval_llm:
        print("\n--- Running Live Chatbot Evaluation ---")
        results_df = evaluate_live_chatbot(eval_df)
        
        if not results_df.empty:
            results_df.to_csv("results_only.csv", index=False)
            print("\nRaw chatbot results:")
            print(results_df.head())
            
            final_df = evaluate_with_ragas(results_df, eval_llm)
            final_df.to_csv("ragas_results.csv", index=False)
            save_to_excel(final_df)
            
            print("\n Evaluation complete! Check 'ragas_scores.xlsx' and 'ragas_results.csv'")
        else:
            print("Live evaluation did not produce any results. Halting.")
    else:
        print("Halting script because LLM connection could not be established.")