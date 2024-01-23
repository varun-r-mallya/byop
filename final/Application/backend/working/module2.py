import spacy
from spacy.matcher import Matcher
import sys
import yake
nlp = spacy.load("en_core_web_sm")

matcher = Matcher(nlp.vocab)
pattern = [{"POS": "NOUN"},] 
matcher.add("NOUNS", [pattern])

def keyword_extract(doc):
    matches = matcher(doc)
    a = []
    for match_id, start, end in matches:
        span = doc[start:end]
        if match_id == nlp.vocab.strings["NOUNS"]:
            a.append(span.text)
        else:
            a.push("None")
    return a

# input = "The food was good but the service was bad. Loved the melancholy breeze"
def analyse(input):
    kw_extractor = yake.KeywordExtractor()
    keywords = kw_extractor.extract_keywords(input)
    doc = nlp(input)
    set([ent.label_ for ent in doc.ents])
    a = keyword_extract(doc)
    for ele in keywords:
        if ele[0] not in a:
            a.append(ele[0])
    return a

# print(analyse(input))

input_sentence = sys.argv[1]
output = analyse(input_sentence)
print(output)