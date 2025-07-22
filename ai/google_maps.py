import os
import googlemaps
from collections import defaultdict
from dotenv import load_dotenv

load_dotenv


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
            image_reference = (
                results["photos"][0]["photo_reference"] if "photos" in results else None
            )
            ratings = results.get("rating", "No ratings available")
            reviews = (
                results["reviews"][0]["text"]
                if "reviews" in results
                else "No reviews available"
            )
        except KeyError as ke:
            return {"error": str(ke)}

        if image_reference:
            _ = self.get_place_photo(image_reference)

        return {
            "address": address,
            "ratings": ratings,
            "reviews": reviews,
        }

    def get_place_photo(self, image_reference):
        """
        gets the corresponding's trail image and writes it in bytes. NOTE: will probably change this for the frontend
        """
        try:
            image = open("test_img.jpg", "wb")
            for chunk in self.client.places_photo(image_reference, max_width=720):
                if chunk:
                    image.write(chunk)
            image.close()
        except IOError as e:
            return "error trying to write file: {}".format(e)
