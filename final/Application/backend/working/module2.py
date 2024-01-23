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

def analyse(sentence):
        # kw_extractor = yake.KeywordExtractor()
        # keywords = kw_extractor.extract_keywords(sentence)
        doc = nlp(sentence)
        set([ent.label_ for ent in doc.ents])
