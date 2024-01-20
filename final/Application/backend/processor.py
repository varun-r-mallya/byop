from flask import Flask, jsonify
import requests

app = Flask(__name__)
Listofreviews = []

@app.route('/')
def ask():
    url = 'http://localhost:4753/api/reviewscollection'
    headers = {'token': "e2a56as86afa89d98a1987f86768b"}
    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        for item in data:
            _id = item['_id']
            review = item['review']
            rating = item['rating']
            reply = item['reply']
            print(f"_id: {_id}, review: {review}, rating: {rating}, reply: {reply}")
            send = {"_id": _id, "reply": "reply from flask"}
            Listofreviews.append(send)
        return Listofreviews
    except:
        return "failed"

@app.route('/deposition', methods=['POST'])
def deposition():
    url = 'http://localhost:4753/api/reviewsdeposition'
    headers = {'token': "e2a56as86afa89d98a1987f86768b"}
    try:
        response = requests.post(url, data=Listofreviews, headers=headers)
        return response.text
    except:
        return "failed"

    


if __name__ == '__main__':
    app.run()
