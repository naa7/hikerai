import os
import googlemaps
import requests
from dotenv import load_dotenv

load_dotenv()


class MapsAPI:
    """
    MapsAPI abstracts over the maps API operations
    """

    def __init__(self) -> None:
        self.API_KEY = os.environ["MAPS_API_KEY"]
        if len(self.API_KEY) <= 0:
            raise AttributeError("unable to create api object")
        self.client = googlemaps.Client(key=self.API_KEY)

    def geocode(self, latitude, longitude):
        return self.client.reverse_geocode((latitude, longitude))

    def get_place_info(self, model_query: str):
        """
        get_place_info returns important information about a given place (trail).
        such as location, ratings, and even the google photo for rendering on the frontend.
        """
        park_name = model_query.get("name")
        if not park_name:
            raise AttributeError("Missing park name")

        place_info = self.client.find_place(park_name, input_type="textquery")
        if not place_info["candidates"]:
            return {"error": "No place found for the given name"}

        place_id = place_info["candidates"][0]["place_id"]
        detailed_info = self.client.place(place_id=place_id)
        try:
            results = detailed_info["result"]
            address = results["formatted_address"]
            url = results["url"]

            image_reference = (
                results["photos"][0]["photo_reference"] if "photos" in results else None
            )
            ratings = results.get("rating", "No ratings available")
            reviews = (
                results["reviews"][0]["text"]
                if "reviews" in results
                else "No reviews available"
            )
            summary = results["editorial_summary"]["overview"]
        except KeyError as ke:
            return {"error": str(ke)}

        image_url = None
        if image_reference:
            image_url = self.get_place_photo(image_reference)

        return {
            "url": url,
            "address": address,
            "ratings": ratings,
            "image": image_url,
            "reviews": reviews,
            "summary": summary,
        }

    def get_place_photo(self, image_reference):
        """
        Gets the corresponding trail image link.
        """
        try:
            base_url = "https://maps.googleapis.com/maps/api/place/photo"
            params = {
                "photoreference": image_reference,
                "maxwidth": 720,
                "key": self.API_KEY,
            }
            url = requests.Request("GET", base_url, params=params).prepare().url
            return url
        except Exception as e:
            return f"Error generating image URL: {e}"
