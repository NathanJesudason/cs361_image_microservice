from flask import Flask
from flask_restful import Resource, Api, reqparse
import requests
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
import config
import json
import io


app = Flask(__name__)
api = Api(app)

class Image(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('query', required=True)
        arg = parser.parse_args()
        headers = {"Ocp-Apim-Subscription-Key" : config.subscription_key}
        params  = {"q": arg['query'], "license": "public", "imageType": "photo", "aspect": "Square", "size": "Large", "count": 1}

        response = requests.get(config.search_url, headers=headers, params=params)
        response.raise_for_status()
        search_results = response.json()
        thumbnail_url = [img["thumbnailUrl"] for img in search_results["value"][:16]][0]
        return {'image_url': thumbnail_url}, 200
    #methods go here

api.add_resource(Image, '/image')

if __name__ == '__main__':
    app.run()