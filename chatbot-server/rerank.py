from flask import Flask, request, jsonify
from sentence_transformers.cross_encoder import CrossEncoder
MODEL_NAME = 'mixedbread-ai/mxbai-rerank-base-v1'
print(f"Loading reranker model: {MODEL_NAME}...")
try:
    model = CrossEncoder(MODEL_NAME, max_length=512)
    print("Reranker model loaded successfully.")
except Exception as e:
    print(f"FATAL: Could not load the reranker model. Error: {e}")
    exit()

app = Flask(__name__)
@app.route('/rerank', methods=['POST'])
def handle_rerank():
    data = request.get_json()
    if not data or 'query' not in data or 'documents' not in data:
        return jsonify({"error": "Missing 'query' or 'documents' in request body"}), 400

    query = data['query']
    documents = data['documents']
    model_input = [[query, doc] for doc in documents]
    scores = model.predict(model_input)
    indexed_scored_docs = []
    for i, doc in enumerate(documents):
        indexed_scored_docs.append({
            "index": i,
            "document": doc,
            "relevance_score": float(scores[i])
        })
    indexed_scored_docs.sort(key=lambda x: x['relevance_score'], reverse=True)
    results = [
        {"index": item["index"], "relevance_score": item["relevance_score"]}
        for item in indexed_scored_docs
    ]
    print(f"Finished scoring {len(documents)} documents for query: '{query[:50]}...'")
    return jsonify({"results": results})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8082)