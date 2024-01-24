from collections import Counter
import pickle
import spacy
from spacy.matcher import Matcher
import sys

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
        else:
            template = template.replace("{Topic Keyword}", "services")
    return template

Listofreviews = []

with open('./models/svm1.pkl', 'rb') as file:
    svm1 = pickle.load(file)
with open('./models/svm2.pkl', 'rb') as file:
    svm2 = pickle.load(file)
with open('./models/svm3.pkl', 'rb') as file:
    svm3 = pickle.load(file)
with open('./models/vectorizer1.pkl', 'rb') as file:
    vectorizer1 = pickle.load(file)
with open('./models/vectorizer2.pkl', 'rb') as file:
    vectorizer2 = pickle.load(file)
with open('./models/vectorizer3.pkl', 'rb') as file:
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
        filled_template = fill_template("We thank you for your review! We hope to improve our {Topic Keyword} in the future.", doc)
        return filled_template
    
    
input_sentence = sys.argv[1]
output = analyse(input_sentence)
print(output)
    