import os
import pandas as pd
import numpy as np
from langchain_community.vectorstores.faiss import FAISS
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
FAISS_INDEX_PATH = "faiss-index-py" 
DATA_SOURCE = "training_data_asknirwan.txt"
EMBEDDING_MODEL = "nomic-embed-text"
GENERATION_MODEL = "gemma:2b"
BASE_URL = "http://localhost:4600"
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
def create_index_if_not_exists():
    if os.path.exists(FAISS_INDEX_PATH):
        print(f"Folder '{FAISS_INDEX_PATH}' already exists.")
        return
    print(f"Folder '{FAISS_INDEX_PATH}' not found. Creating a new index...")
    
    loader = TextLoader(DATA_SOURCE, encoding='utf-8')
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
    docs = text_splitter.split_documents(documents)
    
    print(f"Document split into {len(docs)} chunks.")
    
    embeddings = OllamaEmbeddings(model=EMBEDDING_MODEL, base_url=BASE_URL)
    
    print("Creating embeddings and saving the index... (This may take a moment)")
    db = FAISS.from_documents(docs, embeddings)
    db.save_local(FAISS_INDEX_PATH)
    print("New index successfully created and saved.")
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)
def evaluate_rag(eval_df: pd.DataFrame, rag_chain, retriever):
    results = []
    total_retrieval_hits = 0
    print("\n--- Starting evaluation process ---")
    for index, row in eval_df.iterrows():
        question = row['question']
        ground_truth = row['ground_truth_answer']
        retrieved_docs = retriever.invoke(question)
        retrieved_context = format_docs(retrieved_docs)
        generated_answer = rag_chain.invoke(question)
        retrieval_hit = any(word in retrieved_context.lower() for word in ground_truth.lower().split()[:5])
        if retrieval_hit:
            total_retrieval_hits += 1
            
        results.append({
            "question": question,
            "retrieved_context": retrieved_context,
            "generated_answer": generated_answer,
            "ground_truth_answer": ground_truth,
            "retrieval_hit": "✅ Yes" if retrieval_hit else "❌ No"
        })
        print(f"Evaluation finished for question #{index+1}")
    results_df = pd.DataFrame(results)
    
    return results_df, total_retrieval_hits
def print_classification_style_report(total_hits, total_questions):
    tp = total_hits
    fn = total_questions - total_hits
    
    precision = 1.0 if tp > 0 else 0.0
    recall = tp / total_questions if total_questions > 0 else 0.0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    accuracy = recall
    print("\n--- Retrieval Affinity Report (Classification Style) ---")
    print(f"Classification report with Accuracy: {accuracy:.2f}")
    print(f"Total Data : {total_questions}\n")
    print(f"{'':<20}{'Precision':<12}{'Recall':<12}{'F1-score':<12}{'Support':<12}")
    print("-" * 70)
    print(f"{'Correct Retrieval':<20}{precision:<12.2f}{recall:<12.2f}{f1_score:<12.2f}{total_questions:<12}")
    print("\n")
    print(f"{'Accuracy':<20}{'':<12}{'':<12}{accuracy:<12.2f}{total_questions:<12}")
    print(f"{'Macro avg':<20}{precision:<12.2f}{recall:<12.2f}{f1_score:<12.2f}{total_questions:<12}")
    print(f"{'Weighted avg':<20}{precision:<12.2f}{recall:<12.2f}{f1_score:<12.2f}{total_questions:<12}")
    print("-" * 70)
    print("Note: These metrics measure the 'Retrieval' capability (finding the correct context).")
create_index_if_not_exists()
print("\n--- Initializing RAG components ---")
embeddings = OllamaEmbeddings(model=EMBEDDING_MODEL, base_url=BASE_URL)
try:
    vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    print(f"Faiss index '{FAISS_INDEX_PATH}' loaded successfully.")
except Exception as e:
    print(f"Failed to load Faiss index: {e}")
    exit()
llm = OllamaLLM(model=GENERATION_MODEL, base_url=BASE_URL)
template = """Answer the following question ONLY based on the provided context. If the information is not in the context, say "Informasi tidak ditemukan dalam konteks".
Context:
{context}
Question:
{question}
Answer:
"""
prompt = PromptTemplate.from_template(template)
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
evaluation_results_df, total_retrieval_hits = evaluate_rag(eval_df, rag_chain, retriever)
total_questions = len(eval_df)
for index, row in evaluation_results_df.iterrows():
    print(f"\n===== Question {index+1} =====")
    print(f"Question: {row['question']}")
    print(f"Ground Truth Answer: {row['ground_truth_answer']}")
    print(f"Generated Answer: {row['generated_answer']}")
    print(f"Context Found (Retrieval Hit): {row['retrieval_hit']}")
    print("--------------------")
print_classification_style_report(total_retrieval_hits, total_questions)
print("\n--- Detailed Evaluation per Question ---")
