import pandas as pd
from datasets import Dataset
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from ragas.evaluation import evaluate
from langchain_ollama import ChatOllama, OllamaEmbeddings
import os
import asyncio

# The user has asked to take the lead in analyzing the raw data.
# The provided script already contains the logic to do this. I will replicate that logic here.

# --- 1. Setup Evaluation LLM and Embeddings ---
# This setup assumes a local Ollama server is running as specified in the original script.
# If the user's environment is different, these URLs/models might need adjustment.
try:
    eval_llm = ChatOllama(
        model="qwen2:1.5b",
        base_url="http://localhost:4600" # As per original script
    )
    # A simple invocation to check if the LLM is available.
    eval_llm.invoke("Hi")

    embeddings = OllamaEmbeddings(
        model="mxbai-embed-large",
        base_url="http://localhost:4600" # As per original script
    )
    # A simple embedding check.
    embeddings.embed_query("test")

except Exception as e:
    print("🔴 Could not connect to the local Ollama server on http://localhost:4600.")
    print("   Please ensure Ollama is running and the specified models (qwen2:1.5b, mxbai-embed-large) are available.")
    print(f"   Error: {e}")
    # Exit gracefully if the required services are not running.
    eval_llm = None

# --- 2. Define the Evaluation and Saving Functions (adapted from the script) ---

def evaluate_with_ragas(results_df: pd.DataFrame):
    """
    Evaluates a dataframe with questions, generated answers, and ground truths using RAGAS.
    """
    all_scores = []

    for i in range(len(results_df)):
        # Process one row at a time to create a single-item batch
        row = results_df.iloc[[i]]

        # RAGAS expects a dictionary of lists.
        # 'contexts' is expected to be a list of lists of strings.
        dataset_dict = {
            "question": row["question"].fillna("").tolist(),
            "answer": row["generated_answer"].fillna("").tolist(),
            "contexts": [[str(ctx)] for ctx in row["ground_truth_answer"].fillna("").tolist()],
        }

        ragas_dataset = Dataset.from_dict(dataset_dict)

        print(f"⚡ Evaluating item {i+1}/{len(results_df)}: '{row['question'].iloc[0][:50]}...'")
        try:
            scores = evaluate(
                ragas_dataset,
                metrics=[context_precision, context_recall, faithfulness, answer_relevancy],
                llm=eval_llm,
                embeddings=embeddings,
                raise_exceptions=False, # Set to False to continue on errors
            )
            batch_scores = scores.to_pandas()
            all_scores.append(batch_scores)
        except Exception as e:
            print(f"⚠️ Error evaluating item {i+1}. Skipping. Error: {e}")
            # Create a placeholder DataFrame with error values
            error_scores = pd.DataFrame([{
                "context_precision": float('nan'),
                "context_recall": float('nan'),
                "faithfulness": float('nan'),
                "answer_relevancy": float('nan')
            }])
            all_scores.append(error_scores)


    if not all_scores:
        print("No scores were generated.")
        return pd.DataFrame()

    # Merge the scores back into the original dataframe
    scores_df = pd.concat(all_scores, ignore_index=True)
    final_df = pd.concat([results_df.reset_index(drop=True), scores_df], axis=1)
    return final_df

def save_to_excel(df: pd.DataFrame, filename="ragas_scores.xlsx"):
    """
    Saves the dataframe to a formatted Excel file.
    """
    with pd.ExcelWriter(filename, engine="xlsxwriter") as writer:
        df.to_excel(writer, sheet_name="Scores", index=False)
        workbook = writer.book
        worksheet = writer.sheets["Scores"]

        # Apply conditional formatting
        score_columns = ["context_precision", "context_recall", "faithfulness", "answer_relevancy"]
        for col_num, col_name in enumerate(df.columns):
            if col_name in score_columns:
                # Add a rule for the entire column
                worksheet.conditional_format(1, col_num, len(df), col_num, {
                    'type': '3_color_scale',
                    'min_color': "#F8696B", # Red
                    'mid_color': "#FFEB84", # Yellow
                    'max_color': "#63BE7B", # Green
                })

        # Auto-adjust column widths
        for i, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(col)) + 2
            worksheet.set_column(i, i, max_len)

    print(f"📊 Results saved to {filename}")

# --- 3. Main Execution Logic ---
if eval_llm:
    # Load the raw data provided by the user
    try:
        results_df = pd.read_csv("results_only.csv")
        print("--- Successfully loaded results_only.csv ---")
        print(results_df.head())

        print("\n--- Running RAGAS Evaluation ---")
        final_df = evaluate_with_ragas(results_df)

        # Save the final results to CSV and Excel
        final_df.to_csv("ragas_results.csv", index=False)
        save_to_excel(final_df, "ragas_scores.xlsx")

        print("\n--- RAGAS Evaluation Complete ---")
        print("Final results with scores:")
        print(final_df.head())
        print("\n✅ Analysis complete! Check 'ragas_results.csv' and the formatted 'ragas_scores.xlsx'.")

    except FileNotFoundError:
        print("🔴 Error: 'results_only.csv' not found. Please ensure the file is uploaded correctly.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# This check is good practice for Windows users of asyncio
if os.name == 'nt':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())