import os
import asyncio
import logging
import requests
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from hypercorn.asyncio import serve
from hypercorn.config import Config
from google_maps import MapsAPI


app = Flask(__name__)
CORS(app, origins="*")

# Load environment variables
load_dotenv()

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize SentenceTransformer model
embedding_model = SentenceTransformer("thenlper/gte-large")

maps_api = MapsAPI()


# MongoDB connection
async def get_mongo_client():
    mongo_client = None
    try:
        username = os.getenv("USERNAME")
        password = os.getenv("PASSWORD")
        mongo_uri = f"mongodb+srv://{username}:{password}@hikerai.t4bsryy.mongodb.net/?retryWrites=true&w=majority&appName=hikerai"
        mongo_client = AsyncIOMotorClient(mongo_uri, maxPoolSize=10)
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
    return mongo_client


# Embedding generation
async def get_embeddings(text: str) -> list:
    if not text.strip():
        logger.warning("Attempted to get embedding for empty text.")
        return []
    try:
        embedding = await asyncio.to_thread(embedding_model.encode, text)
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Failed to generate embedding: {e}")
        return []


# Vector search
async def vector_search(user_query: str, collection) -> list:
    query_embedding = await get_embeddings(user_query)
    if not query_embedding:
        return "Invalid query or embedding generation failed."
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "queryVector": query_embedding,
                "path": "embedding",
                "numCandidates": 150,
                "limit": 1,
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
    try:
        results = await collection.aggregate(pipeline).to_list(length=None)
        return results
    except Exception as e:
        logger.error(f"Failed to perform vector search: {e}")
        return []


# Search result formatting
async def get_search_result(query: str, collection) -> str:
    search_result = await vector_search(query, collection)
    formatted_result = {}
    for result in search_result:
        embedding_score = result.get("Embedding_Score", "N/A")
        if float(embedding_score) > 0.91:
            formatted_result["name"] = result.get("Park_Name", "N/A")
            formatted_result["difficulty"] = result.get("Difficulty", "N/A").strip()
            formatted_result["latitude"] = result.get("Latitude", "N/A")
            formatted_result["longitude"] = result.get("Longitude", "N/A")
            formatted_result["trail"] = result.get("Trail_Name", "N/A")
    return formatted_result


# Sending message to chatbot
async def send_message_to_chatbot(input_message: str, history: list) -> dict:
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
        "keep_alive": "30m",
    }
    try:
        response = await asyncio.to_thread(requests.post, url, json=payload)
        return response.json()
    except Exception as e:
        logger.error(f"Failed to send message to chatbot: {e}")
        return {}


# API endpoint for querying hiking trails
@app.route("/query", methods=["POST"])
async def query_hiking_trail():
    try:
        data = request.json
        query = data.get("query", "").lower()
        history = data.get("history", [])
        mongo_client = await get_mongo_client()
        collection = mongo_client["hikerai"]["nyc_hiking_trails"]
        search_result = await get_search_result(query, collection)
        # combined_information = (
        #     query
        #     if not search_result
        #     else f"Query: {query}\n\nTask: Your task is to return without anything else just one JSON object of the best match for the query using the provided search results. If none of the search results match the query, apologize to the user and ask if you can help with anything else.\n\nSearch Results:\n{search_result}"
        # )
        if not search_result:
            response = await send_message_to_chatbot(query, history)
            if response and "message" in response and "content" in response["message"]:
                return jsonify({"message": response["message"]["content"]})
            else:
                return jsonify({"message": "Failed to get response from chatbot."}), 500

        place_info = maps_api.get_place_info(search_result)
        place_info["name"] = "Bronx Park"
        place_info["image"] = (
            "https://upload.wikimedia.org/wikipedia/commons/3/3b/Rymill_park_path.jpg"
        )
        place_info["difficulty"] = "Easy"
        place_info["trailLength"] = "5 miles"
        place_info["noise"] = "Low"
        return jsonify({"message": place_info})

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        return jsonify({"message": "Internal server error"}), 500


# async def start_server():
#     config = Config()
#     config.bind = ["0.0.0.0:5000"]
#     config.debug = True
#     await serve(app, config)


# Main function to run the server
if __name__ == "__main__":
    # asyncio.run(start_server())
    app.run(host="0.0.0.0", port=5000, debug=True)
