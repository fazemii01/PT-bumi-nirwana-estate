import os
import pandas as pd
import numpy as np
import socketio
import time
import re
from threading import Event

SOCKETIO_URL = 'http://localhost:4500'
CHAT_EVENT_EMIT = 'message'
CHAT_EVENT_RECEIVE = 'response'
CHAT_CLEAR_HISTORY = 'clear history'


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
        
 
        hit = False
        lower_generated = generated_answer.lower()
        lower_ground_truth = ground_truth.lower()

        negative_keywords = ["tidak ditemukan", "tidak menemukan", "tidak dapat menemukan", "tidak tersedia"]
        is_ground_truth_negative = any(phrase in lower_ground_truth for phrase in negative_keywords)

        if is_ground_truth_negative:
            if any(phrase in lower_generated for phrase in negative_keywords):
                hit = True
        else:
            gt_words = set(re.sub(r'[^\w\s]', '', lower_ground_truth).split())
            stop_words = {'di', 'ke', 'dari', 'dan', 'ini', 'itu', 'adalah', 'untuk', 'yang', 'dengan'}
            key_info_words = gt_words - stop_words
            
            if len(key_info_words) > 0:
                words_found = 0
                for word in key_info_words:
                    if word in lower_generated:
                        words_found += 1
                
                match_percentage = words_found / len(key_info_words)
                if match_percentage > 0.7:
                    hit = True
    
        
        if hit:
            total_hits += 1

        results.append({
            "question": question,
            "generated_answer": generated_answer,
            "ground_truth_answer": ground_truth,
            "result_hit": "✅ Yes" if hit else "❌ No"
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