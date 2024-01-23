from collections import Counter
import pickle

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
        return 1
    elif most_common_number == -1:
        return -1
    elif most_common_number == 0:
        return 0
    