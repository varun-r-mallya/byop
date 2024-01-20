from collections import Counter
import pickle
from flask import Flask, jsonify
import requests
app = Flask(__name__)
Listofreviews = []

with open('./final/sentimentalanalysis/notebooks/working/svm1.pkl', 'rb') as file:
    svm1 = pickle.load(file)
with open('./final/sentimentalanalysis/notebooks/working/svm2.pkl', 'rb') as file:
    svm2 = pickle.load(file)
with open('./final/sentimentalanalysis/notebooks/working/svm3.pkl', 'rb') as file:
    svm3 = pickle.load(file)
with open('./final/sentimentalanalysis/notebooks/working/vectorizer1.pkl', 'rb') as file:
    vectorizer1 = pickle.load(file)
with open('./final/sentimentalanalysis/notebooks/working/vectorizer2.pkl', 'rb') as file:
    vectorizer2 = pickle.load(file)
with open('./final/sentimentalanalysis/notebooks/working/vectorizer3.pkl', 'rb') as file:
    vectorizer3 = pickle.load(file)

def analyse(sentence):
    one = svm1.predict(vectorizer1.transform([sentence]))[0]
    two = svm2.predict(vectorizer2.transform([sentence]))[0]
    three = svm3.predict(vectorizer3.transform([sentence]))[0]

    numbers = [one, two, three]
    counter = Counter(numbers)
    most_common_number = counter.most_common(1)[0][0]
    if most_common_number == 1:
        return "We are glad that you are happy with our services!"
    elif most_common_number == -1:
        return "We are sorry that you are unhappy with our services. Kindly tell us how we can improve."
    elif most_common_number == 0:
        return "We are glad that you are satisfied with our services!"
    
@app.route('/', methods=['POST', 'GET'])
def ask():
    url = 'http://localhost:4753/api/reviewscollection'
    headers = {'token': "e2a56as86afa89d98a1987f86768b"}
    response = requests.get(url, headers=headers)
    data = response.json()
    for item in data:
        _id = item['_id']
        review = item['review']
        rating = item['rating']
        reply = item.get('reply')
        print(f"_id: {_id}, review: {review}, rating: {rating}, reply: {reply}")
        new_reply = analyse(review)
        print(new_reply)
        send = {"_id": _id, "reply": new_reply}
        if send not in Listofreviews:
            Listofreviews.append(send)   

    url2 = 'http://localhost:4753/api/reviewsdeposition'
    response2 = requests.post(url2, json=Listofreviews, headers=headers)
    return response2.text

if __name__ == '__main__':
    app.run()