import os
import requests
from dotenv import load_dotenv
import pymongo
import pymongo.server_api
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app, origins="*")

load_dotenv()
embedding_model = SentenceTransformer("thenlper/gte-large")


def get_embeddings(text: str) -> list[float]:
    """
    Get embeddings for the input text using SentenceTransformer model.

    Args:
        text (str): Input text for embedding.

    Returns:
        list[float]: List of embeddings for the input text.
    """
    if not text.strip():
        print("Attempted to get embedding for empty text.")
        return []

    embedding = embedding_model.encode(text)
    return embedding.tolist()


def connect_to_mongo() -> pymongo.collection.Collection:
    """
    Connect to MongoDB and return the collection for NYC hiking trails.

    Returns:
        pymongo.collection.Collection: MongoDB collection for NYC hiking trails.
    """
    username = os.getenv("USERNAME")
    password = os.getenv("PASSWORD")
    mongo_uri = f"mongodb+srv://{username}:{password}@hikerai.t4bsryy.mongodb.net/?retryWrites=true&w=majority&appName=hikerai"

    try:
        mongo_client = pymongo.MongoClient(
            mongo_uri, server_api=pymongo.server_api.ServerApi("1")
        )
        mongo_client.admin.command("ping")
        return mongo_client["hikerai"]["nyc_hiking_trails"]
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None


def vector_search(user_query: str, collection: pymongo.collection.Collection) -> list:
    """
    Perform a vector search in the MongoDB collection based on the user query.

    Args:
        user_query (str): The user's query string.
        collection (pymongo.collection.Collection): The MongoDB collection to search.

    Returns:
        list: A list of matching documents.
    """
    query_embedding = get_embeddings(user_query)
    if not query_embedding:
        return "Invalid query or embedding generation failed."

    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "queryVector": query_embedding,
                "path": "embedding",
                "numCandidates": 150,
                "limit": 10,
            }
        },
        {
            "$project": {
                "_id": 0,
                "Park_Name": 1,
                "Trail_Name": 1,
                "Latitude": 1,
                "Longitude": 1,
                "Difficulty": 1,
                "Borough": 1,
                "Surface": 1,
                "Embedding_Score": {"$meta": "vectorSearchScore"},
            }
        },
    ]

    results = collection.aggregate(pipeline)
    return list(results)


def get_search_result(query: str, collection: pymongo.collection.Collection) -> str:
    """
    Get search results for the user query from MongoDB collection.

    Args:
        query (str): The user's query string.
        collection (pymongo.collection.Collection): The MongoDB collection to search.

    Returns:
        str: A formatted string containing search results.
    """
    search_results = vector_search(query, collection)
    formatted_results = ""
    for result in search_results:
        embedding_score = result.get("Embedding_Score", "N/A")
        if float(embedding_score) > 0.91:
            formatted_results += f"Park: {result.get('Park_Name', 'N/A')}, Trail: {result.get('Trail_Name', 'N/A')}, Borough: {result.get('Borough', 'N/A')}, Surface: {result.get('Surface', 'N/A')}, Difficulty: {result.get('Difficulty', 'N/A')}, Latitude: {result.get('Latitude', 'N/A')}, Longitude: {result.get('Longitude', 'N/A')}, Score: {result.get('Embedding_Score', 'N/A')}\n"
    return None if formatted_results is None else formatted_results


def send_message_to_chatbot(input_message: str, history: list) -> dict:
    """
    Send a message to the chatbot API and return the response.

    Args:
        input_message (str): The user's input message.
        history (list): List of previous messages in the conversation.

    Returns:
        dict: The response from the chatbot API.
    """
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": "dolphin-phi",
        "messages": [
            {
                "role": "system",
                "content": "You are HikerAI, an expert on hiking trails in New York City (NYC). Your role is to help users find the perfect hiking adventure in NYC. Ask about trail locations, difficulty levels, lengths, ratings, and any other hiking-related details. Provide clear, concise, and accurate responses. Only provide relevant information and do not hallucinate. When suggesting hiking trails, highlight the park's name in bold and list its details in an organized way. If unsure, say 'I don't know.' If users ask about conversation's history, you will share only the user's messages.",
            },
            *[
                {"role": message["role"], "content": message["response"]}
                for message in history
            ],
            {"role": "user", "content": input_message.strip()},
        ],
        "stream": False,
        "keep_alive": "10m",
    }

    try:
        response = requests.post(url, json=payload)
        return response.json()
    except Exception as e:
        print(f"Failed to send message to chatbot: {e}")
        return {}


@app.route("/query", methods=["POST"])
def query_hiking_trail():
    data = request.json
    query = data.get("query", "").lower()
    history = data.get("history", [])
    collection = connect_to_mongo()
    if collection is not None:
        search_result = get_search_result(query, collection)
        combined_information = (
            query
            if not search_result
            else f"Query: {query}\n\nTask: Your task is to return without anything else just one JSON object of the best match for the query using the provided search results. If none of the search results match the query, apologize to the user and ask if you can help with anything else.\n\nSearch Results:\n{search_result}"
        )
        print(combined_information)
        response = send_message_to_chatbot(combined_information, history)
        if response and "message" in response and "content" in response["message"]:
            return jsonify({"message": response["message"]["content"]})
        else:
            return jsonify({"message": "Failed to get response from chatbot."}), 500
    else:
        return jsonify({"message": "Failed to connect to MongoDB."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
