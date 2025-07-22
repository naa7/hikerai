from pymongo.mongo_client import MongoClient
import pymongo.errors
from typing import Any
from dotenv import load_dotenv
import os

load_dotenv()

#https://docs.google.com/forms/d/1v4cUDyAbS6WpEggTx3LnMHdJNxQOiWTuPyTLrKrjLHM/viewform?edit_requested=true
class MongoDB():
    """
    The MongoDB class abstracts MongoDB operations from the client
    """
    
    def __init__(self) -> None:
        self.conn_string = os.environ["MONGO_URI"]
        self.colection = "documents"
        try:
            self.connection = MongoClient(self.conn_string)
            self.db = self.connection.get_database("hiker_ai")
        except pymongo.errors.ConnectionFailure as e:
            raise("error trying to get database from mongodb {}".format(e))
    
    def store_documents(self, documents):
        try:
            self.db["documents"].insert_many(documents)
        except Exception as e:
            print("error inserting documents: {}".format(e))
        
    def vector_search(self, user_query, embedding_model) -> list[Any]:
        """
        Perform a vector search in the MongoDB collection based on the user query.

        Args:
        user_query (str): The user's query string.
        collection (MongoCollection): The MongoDB collection to search.

        Returns:
        list: A list of matching documents.
        """
        # Generate embedding for the user query.
        query_embedding = embedding_model.encode(user_query).tolist()

        if query_embedding is None:
            return "Invalid query or embedding generation failed."

        # Define the vector search MongoDB aggregation pipeline.
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "queryVector": query_embedding,
                    "path": "embedding",
                    "numCandidates": 5,  # Number of candidate documents to consider.
                    "limit": 4,  # Return top 4 matches.
                }
            },
            {
                "$project": {
                    "_id": 0,  # Exclude the _id field.
                    "fullplot": 1,  # Include the plot field.
                    "title": 1,  # Include the title field.
                    "genres": 1,  # Include the genres field.
                    "score": {"$meta": "vectorSearchScore"},  # Include the search similarity score.
                }
            },
        ]
        # Execute the vector search MongoDB aggregation pipeline.
        results = self.db[self.colection].aggregate(pipeline)
        return list(results)
