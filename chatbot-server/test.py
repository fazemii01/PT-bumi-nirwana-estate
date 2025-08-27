import os
import pandas as pd
import numpy as np
import socketio
import time
from langchain_community.vectorstores.faiss import FAISS
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from threading import Event

# FAISS_INDEX_PATH = "faiss-index-py" 
# DATA_SOURCE = "training_data_asknirwan.txt"
# EMBEDDING_MODEL = "nomic-embed-text"
# GENERATION_MODEL = "qwen2:1.5b"
SOCKETIO_URL = 'http://localhost:4500' 
CHAT_EVENT_EMIT = 'message'   
CHAT_EVENT_RECEIVE = 'reply' 
CHAT_CLEAR_HISTORY = 'clear history'
# BASE_URL = "http://localhost:4600"
test_data = {
    "question": [
        "Berapa DP untuk rumah subsidi di Margojoyo Residence?",
        "Perumahan apa yang punya kolam renang?",
        "Sebutkan 3 syarat untuk mengajukan KPR.",
        "Listrik untuk rumah subsidi berapa watt?",
        "Promo apa yang ada di Bumi Nirwana Sumberejo?",
        "Saya seorang PNS, dokumen apa saja yang perlu saya siapkan untuk KPR?",
        "Jika saya ambil tenor KPR 15 tahun di Margojoyo, berapa cicilannya?",
        "Perumahan mana yang paling dekat dengan Alun-alun Lumajang?",
        "Saya mau investasi ruko, ada pilihan apa dan berapa harganya?",
        "Bandingkan promo antara The Margojoyo Residence dan Bumi Nirwana Sumberejo.",
        "Berapa luas tanah untuk The Royal Avenue?",
        "Apakah ada fasilitas kolam renang umum di Margojoyo Residence?",
        "Berapa angsuran untuk The Royal Avenue?",
        "Apakah ada tipe rumah dengan 3 kamar tidur?",
        "Saya baru menikah dan budget terbatas, baiknya saya pilih yang mana?",
        "Kenapa saya harus memilih The Royal Avenue dibandingkan perumahan lain?",
        "Saya khawatir proses KPR ribet, bisa bantu jelaskan?",
        "Kalau saya mau lihat-lihat lokasinya langsung, bagaimana caranya?",
        "Apa keuntungan utama punya rumah di Bumi Nirwana Estate?",
        "Jika UTJ saya hangus, apakah DP juga hangus?"
    ],
    "ground_truth_answer": [
        "DP untuk tipe subsidi di The Margojoyo Residence adalah Rp 1.660.000.",
        "The Royal Avenue adalah perumahan yang memiliki kolam renang pribadi.",
        "Tiga syarat KPR adalah Fotocopy KTP/KK/NPWP, Surat Nikah, dan Slip Gaji 3 bulan terakhir.",
        "Listrik untuk rumah subsidi adalah 900 Watt.",
        "Promo di Bumi Nirwana Sumberejo adalah Tanpa DP (0%) dan Free Semua Biaya.",
        "Sebagai PNS, Anda perlu menyiapkan syarat umum KPR ditambah SK Terakhir.",
        "Angsuran untuk tenor 15 tahun di The Margojoyo Residence adalah Rp 1.299.000 per bulan.",
        "The Margojoyo Residence adalah yang paling dekat, hanya 5 menit dari Alun-alun Lumajang.",
        "Ada pilihan Ruko 2 lantai di The Margojoyo Residence seharga Rp 250.000.000.",
        "Promo di Margojoyo adalah DP ringan 1% dan Free AJB/BPHTB, sedangkan di Sumberejo ada promo Tanpa DP 0%.",
        "Informasi mengenai luas tanah The Royal Avenue tidak ditemukan dalam konteks.",
        "Informasi mengenai kolam renang umum di Margojoyo Residence tidak ditemukan.",
        "Informasi mengenai simulasi angsuran The Royal Avenue tidak ditemukan.",
        "Informasi mengenai tipe rumah dengan 3 kamar tidur tidak ditemukan dalam konteks.",
        "Untuk keluarga baru dengan budget terbatas, rumah subsidi di Bumi Nirwana Sumberejo bisa jadi pilihan tepat karena ada promo Tanpa DP.",
        "The Royal Avenue menawarkan kemewahan dan lokasi premium di pusat kota dengan fasilitas lengkap termasuk kolam renang pribadi.",
        "Proses KPR tidak serumit yang dibayangkan. Anda hanya perlu menyiapkan dokumen seperti KTP, KK, dan slip gaji, tim kami akan membantu prosesnya.",
        "Anda bisa menghubungi tim marketing kami di nomor 081999998000 untuk mengatur jadwal survey lokasi.",
        "Keuntungan utamanya adalah mendapatkan hunian berkualitas di lokasi strategis dengan harga terjangkau dan berbagai promo menarik.",
        "Uang Tanda Jadi (UTJ) tidak dapat kembali, namun jika KPR ditolak karena BI Checking, DP bisa dikembalikan."
    ]
}
eval_df = pd.DataFrame(test_data)
sio = socketio.Client()
response_data = None
response_event = Event()

@sio.event
def connect():
    print("Socket.IO client connected successfully!")

@sio.event
def connect_error(data):
    print(f"Connection failed: {data}")

@sio.event
def disconnect():
    print("Socket.IO client disconnected.")

@sio.on(CHAT_EVENT_RECEIVE)
def on_message(data):
    global response_data
    print(f"Received answer from server: {data}")
    response_data = data
    response_event.set()

def evaluate_live_chatbot(eval_df: pd.DataFrame):
    results = []
    total_hits = 0
    print("\n--- Starting evaluation process with live chatbot ---")

    try:
        sio.connect(SOCKETIO_URL, transports=['websocket'])
    except socketio.exceptions.ConnectionError as e:
        print(f"FATAL: Could not connect to server. Aborting test. Error: {e}")
        return pd.DataFrame(), 0

    for index, row in eval_df.iterrows():
        response_event.clear()
        global response_data
        response_data = None
        
        if not sio.connected:
            print("Client disconnected, reconnecting...")
            try:
                sio.connect(SOCKETIO_URL, transports=['websocket'])
            except socketio.exceptions.ConnectionError:
                results.append({"generated_answer": "RECONNECT_FAILED", "question": row["question"], "ground_truth_answer": row["ground_truth_answer"], "result_hit": "❌ No"})
                continue
        sio.emit(CHAT_CLEAR_HISTORY)
        time.sleep(0.5)

        question = row['question']
        ground_truth = row['ground_truth_answer']
        print(f"\nSending question #{index+1}: {question}")
        sio.emit(CHAT_EVENT_EMIT, question)
        
        event_was_set = response_event.wait(timeout=80)
        
        if not event_was_set:
            generated_answer = "TIMEOUT_ERROR"
        else:
            generated_answer = response_data
        
        # FIX: Added the hit calculation and result_hit key back
        hit = False
        lower_generated = generated_answer.lower()
        lower_ground_truth = ground_truth.lower()
        if "tidak ditemukan" in lower_ground_truth or "tidak menemukan" in lower_ground_truth:
            if "tidak ditemukan" in lower_generated or "tidak menemukan" in lower_generated:
                hit = True
        else:
            key_words = [word for word in lower_ground_truth.split() if len(word) > 2][:4]
            if len(key_words) > 0 and all(word in lower_generated for word in key_words):
                hit = True
        
        if hit:
            total_hits += 1

        results.append({
            "question": question,
            "generated_answer": generated_answer,
            "ground_truth_answer": ground_truth,
            "result_hit": "✅ Yes" if hit else "❌ No" # The missing key
        })
        print(f"Evaluation finished for question #{index+1}")

    sio.disconnect()
    results_df = pd.DataFrame(results)
    return results_df, total_hits

def print_classification_style_report(total_hits, total_questions):
    tp = total_hits
    fn = total_questions - total_hits
    
    precision = 1.0 
    recall = tp / total_questions if total_questions > 0 else 0.0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    accuracy = recall

    print("\n--- Live Answer Affinity Report (Classification Style) ---")
    print(f"Classification report with Accuracy: {accuracy:.2f}")
    print(f"Total Data : {total_questions}\n")
    print(f"{'':<20}{'Precision':<12}{'Recall':<12}{'F1-score':<12}{'Support':<12}")
    print("-" * 70)
    print(f"{'Correct Answer':<20}{precision:<12.2f}{recall:<12.2f}{f1_score:<12.2f}{total_questions:<12}")
    print("\n")
    print(f"{'Accuracy':<20}{'':<12}{'':<12}{accuracy:<12.2f}{total_questions:<12}")
    print(f"{'Macro avg':<20}{precision:<12.2f}{recall:<12.2f}{f1_score:<12.2f}{total_questions:<12}")
    print(f"{'Weighted avg':<20}{precision:<12.2f}{recall:<12.2f}{f1_score:<12.2f}{total_questions:<12}")
    print("-" * 70)
    print("Note: These metrics measure if the final answer contains the correct information.")

# --- Main Execution ---
print("--- Initializing Chatbot Live Evaluation Client ---")
evaluation_results_df, total_hits = evaluate_live_chatbot(eval_df)
total_questions = len(eval_df)
print_classification_style_report(total_hits, total_questions)

print("\n--- Detailed Evaluation per Question ---")
for index, row in evaluation_results_df.iterrows():
    print(f"\n===== Question {index+1} =====")
    print(f"Question: {row['question']}")
    print(f"Ground Truth Answer: {row['ground_truth_answer']}")
    print(f"Live Generated Answer: {row['generated_answer']}")
    print(f"Answer Contains Key Info (Result Hit): {row['result_hit']}")
    print("-----------------------------------")

evaluation_results_df.to_csv("live_chatbot_evaluation_results.csv", index=False)
print("\nEvaluation complete. Results saved to 'live_chatbot_evaluation_results.csv'")