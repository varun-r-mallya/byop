from collections import Counter
import pickle
from flask import Flask, jsonify
import requests
# import yake
# import numpy as np
# import pandas as pd
import spacy
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_sm")

matcher = Matcher(nlp.vocab)
pattern = [{"POS": "NOUN"},] 
matcher.add("NOUNS", [pattern])

def fill_template(template, doc):
    matches = matcher(doc)
    for match_id, start, end in matches:
        span = doc[start:end]
        if match_id == nlp.vocab.strings["NOUNS"]:
            template = template.replace("{Topic Keyword}", span.text)
    return template

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
    # kw_extractor = yake.KeywordExtractor()
    # keywords = kw_extractor.extract_keywords(sentence)
    doc = nlp(sentence)
    set([ent.label_ for ent in doc.ents])

    if most_common_number == 1:
        filled_template = fill_template("We are glad that you are happy with our services! It makes us happy to hear that you liked the {Topic Keyword}.", doc)
        return filled_template
    elif most_common_number == -1:
        filled_template = fill_template("We are sorry that you are unhappy with our services. Kindly tell us how we can improve our {Topic Keyword}.", doc)
        return filled_template
    elif most_common_number == 0:
        filled_template = fill_template("We are glad that you are satisfied with our services! We hope to improve our {Topic Keyword} in the future.", doc)
        return filled_template
    
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