<h1>Google Review Reply Bot</h1>
<ol>
  <li>This application uses NLP to analyse sentiments of the reviews using a pre-trained algorithm and then uses LDA trained bagofwords or TfIdf based models to predict the topics of the array. Also uses spaCy's NER and YAKE. The dataset used is a culmination of various datasets I found on the internet</li>
  <li>There is also a front end.</li>
  <li>A Google My Busniness like review/rating/reply display is shown and it performs the work of Google's API, for free.</li>
</ol>
<h2>How to Run Main Application</h2>
<ol>
<li>Start MongoDB on default port
<li>Install all required python modules like Spacy, NLTK, tensorflow, regex, and many more.
<li>Download all the pickle files into Application/backend/express/working (svm1.pkl, svm2.pkl, svm3.pkl, vectorizer1.pkl, vectorizer2.pkl, vectorizer3.pkl)
<li>Start the frontend in GoogleReplacement using <code>npm run dev</code>
<li>Start the backend in GoogleReplacement using <code>npm run dev</code>
<li>Start the backend in Application/backend/express using <code>npm run start</code> ( inside the virtual environment)
<li>Start the frontend in Application/frontend using <code>npm run dev</code>
</ol>
<h2>How to run NamedEntityRecognition</h2>
<ol>
<li>Download the dataset called ner_dataset.csv from the provided link
<li>have CUDA toolkit installed
<li>have tensorflow for CUDA GPUs installed
<li>There are two models called model_train and get_bilstm_lstm_model
<li>Number of epochs can be adjusted
<li>final results have some problems that I could not correct due to time-constraints

</ol>
<h2>TopicExtraction</h2>
<ol>
<li>There are frankly too many datasets I used, so I cannot upload them.
<li>Please review the code only.
</ol>
