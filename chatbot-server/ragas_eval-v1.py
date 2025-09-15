import os
import pandas as pd
import socketio
import time
from threading import Event
import re
import matplotlib.pyplot as plt

from datasets import Dataset
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from ragas.evaluation import evaluate
import os
os.environ["OPENAI_API_KEY"] = "your_key_here"
# --- Socket.IO Setup ---
SOCKETIO_URL = 'http://localhost:4500'
CHAT_EVENT_EMIT = 'message'
CHAT_EVENT_RECEIVE = 'response'
CHAT_CLEAR_HISTORY = 'clear history'

sio = socketio.Client()
response_data = None
response_event = Event()

@sio.event
def connect():
    print("✅ Socket.IO client connected successfully!")

@sio.event
def connect_error(data):
    print(f"❌ Connection failed: {data}")

@sio.event
def disconnect():
    print("⚠️ Socket.IO client disconnected.")

@sio.on(CHAT_EVENT_RECEIVE)
def on_message(data):
    global response_data
    print(f"📥 Received answer from server: {data}")
    response_data = data
    response_event.set()

# --- Evaluation with chatbot ---
def evaluate_live_chatbot(eval_df: pd.DataFrame):
    results = []

    try:
        sio.connect(SOCKETIO_URL, transports=['websocket'])
    except socketio.exceptions.ConnectionError as e:
        print(f"FATAL: Could not connect to server. Aborting test. Error: {e}")
        return pd.DataFrame()

    for index, row in eval_df.iterrows():
        response_event.clear()
        global response_data
        response_data = None

        if not sio.connected:
            print("Client disconnected, reconnecting...")
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
        print(f"\n➡️ Sending question #{index+1}: {question}")
        sio.emit(CHAT_EVENT_EMIT, question)

        event_was_set = response_event.wait(timeout=60)

        if not event_was_set:
            generated_answer = "TIMEOUT_ERROR"
        else:
            generated_answer = response_data

        results.append({
            "question": question,
            "ground_truth_answer": ground_truth,
            "generated_answer": generated_answer
        })
        print(f"✅ Finished evaluation for question #{index+1}")

    sio.disconnect()
    results_df = pd.DataFrame(results)
    return results_df

# --- Apply RAGAS ---
def evaluate_with_ragas(results_df: pd.DataFrame):
    dataset_dict = {
        "question": results_df["question"].tolist(),
        "answer": results_df["generated_answer"].tolist(),
        "contexts": [[ctx] for ctx in results_df["ground_truth_answer"].tolist()],
        "reference": results_df["ground_truth_answer"].tolist()   # ✅ required for context metrics
    }

    ragas_dataset = Dataset.from_dict(dataset_dict)

    scores = evaluate(
        ragas_dataset,
        metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
    )

    scores_df = scores.to_pandas()
    final_df = pd.concat([results_df, scores_df], axis=1)
    return final_df

# --- Save as image ---
def save_table_image(df: pd.DataFrame, filename="ragas_scores_table.png"):
    fig, ax = plt.subplots(figsize=(16, len(df) * 0.7))
    ax.axis("off")
    table = ax.table(
        cellText=df.values,
        colLabels=df.columns,
        loc="center",
        cellLoc="center"
    )
    table.auto_set_font_size(False)
    table.set_fontsize(8)
    table.scale(1.2, 1.2)
    plt.savefig(filename, bbox_inches="tight")
    print(f"📸 Table image saved as {filename}")

# --- Main Execution ---
if __name__ == "__main__":
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

    print("\n--- Running Live Evaluation ---")
    results_df = evaluate_live_chatbot(eval_df)

    print("\n--- Running RAGAS Evaluation ---")
    final_df = evaluate_with_ragas(results_df)

    final_df.to_csv("ragas_evaluation_results.csv", index=False)
    save_table_image(final_df)

    print("\n✅ Evaluation complete. Results saved to CSV and image.")
