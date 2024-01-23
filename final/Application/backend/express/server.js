const express = require('express');
const cors = require('cors');
const axios = require('axios');
const exec = require('child_process').exec;
const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;
var State = true;
app.get('/', (req, res) => { res.send('server is working') })

app.post('/toggle', (req, res) => {
    if (req.headers.state === "true") {
        State = true;
    } 
    else if (req.headers.state === "false") {
        State = false;
    }
    res.json({ state: State });
});

app.get("/panelwords", (req, res) => {
    if(State === false){
    const url = 'http://localhost:4753/api/reviewscollection';

        axios.get(url)
            .then(response => {
                const sentiment = [];
                const promises = response.data.map((item) => {
                    return new Promise((resolve, reject) => {
                        exec(`python3 ../working/module2.py "${item.review}"`, (err, stdout, stderr) => {
                            if (err) {
                                console.log(stderr);
                                reject(err);
                            } else {
                                stdout = stdout.replace(/\n/g, '');
                                const wordsRegex = /'([^']*)'/g;
                                let match;
                                const words = [];
                                while ((match = wordsRegex.exec(stdout)) !== null) {
                                    words.push(match[1]);
                                }
                                const body = {
                                    "_id": item._id,
                                    "review": item.review,
                                    "words": words,
                                }
                                sentiment.push(body);
                                resolve();
                            }
                        });
                    });
                });
    
                Promise.all(promises)
                    .then(() => {
                        console.log(sentiment);
                        res.json({message: sentiment});
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({message: 'Error occurred while fetching reviews'});
                    });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({message: 'Error occurred while fetching reviews'});
            });
    }
    else{
        res.status(400).json({ message: `automode_on` });
    }
})

app.get("/panelsenti", (req, res) => {
    const url = 'http://localhost:4753/api/reviewscollection';

    axios.get(url)
        .then(response => {
            console.log(response.data);
            const sentiment = [];
            const promises = response.data.map((item) => {
                return new Promise((resolve, reject) => {
                    exec(`python3 ../working/module1.py "${item.review}"`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(stderr);
                            reject(err);
                        } else {
                            stdout = stdout.replace(/\n/g, '');
                            const body = {
                                "_id": item._id,
                                "sentiment": stdout,
                            }
                            sentiment.push(body); 
                            resolve();
                        }
                    });
                });
            });

            Promise.all(promises)
                .then(() => {
                    console.log(sentiment);
                    res.json({"sentiment": sentiment});
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({message: 'Error occurred while fetching reviews'});
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: 'Error occurred while fetching reviews'});
        });
})


app.get("/auto", (req, res) => {
    if (State === true) {
        const url = 'http://localhost:4753/api/reviewscollection';

        axios.get(url)
            .then(response => {
                console.log(response.data);
                const sentiment = [];
                const promises = response.data.map((item) => {
                    return new Promise((resolve, reject) => {
                        exec(`python3 ../working/module3.py "${item.review}"`, (err, stdout, stderr) => {
                            if (err) {
                                console.log(stderr);
                                reject(err);
                            } else {
                                stdout = stdout.replace(/\n/g, '');
                                const body = {
                                    "_id": item._id,
                                    "review": item.review,
                                    "rating": item.rating,
                                    "reply": stdout,
                                }
                                sentiment.push(body); 
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(promises)
                    .then(() => {
                        console.log(sentiment);
                        try{
                        axios.post('http://localhost:4753/api/reviewsdeposition', sentiment)
                        }
                        catch(error){
                            console.error(error);
                            res.status(500).json({message: 'Error occurred while posting reviews'});
                        }
                        res.json({message: response.data});
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).json({message: 'Error occurred while fetching reviews'});
                    });
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({message: 'Error occurred while fetching reviews'});
            });
    } else {
        res.status(400).json({ message: `automode_off` });
    }
});
app.get('/getreviews', (req, res) => {
    const url = 'http://localhost:4753/api/reviewscollection';

    axios.get(url)
        .then(response => {
            console.log(response.data);
            res.json({message: response.data});
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: 'Error occurred while fetching reviews'});
        });
});

app.get('/panelanalytics', (req, res) => {
    const url = 'http://localhost:4753/api/reviewscollection';

    function mean(arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    function median(arr) {
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }
    function mode(arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length
            - arr.filter(v => v === b).length
        ).pop();
    }
    
    axios.get(url)
        .then(response => {
            console.log(response.data);
            const rating = [];
            const reviewLength = [];
            const promises = response.data.map((item) => {
                return new Promise((resolve, reject) => {
                    rating.push(item.rating);
                    reviewLength.push(item.review.length);
                    resolve();
                });
            });

            Promise.all(promises)
                .then(() => {
                    const mean_rating = mean(rating);
                    const median_rating = median(rating);
                    const mode_rating = mode(rating);
                    const mean_reviewLength = mean(reviewLength);
                    const median_reviewLength = median(reviewLength);
                    const mode_reviewLength = mode(reviewLength);
                    const body = {
                        "mean": mean_rating,
                        "median": median_rating,
                        "mode": mode_rating,
                        "meanRL": mean_reviewLength,
                        "medianRL": median_reviewLength,
                        "modeRL": mode_reviewLength,
                    }
                    console.log(body);
                    res.json({message: body});
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).json({message: 'Error occurred while fetching reviews'});
                });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: 'Error occurred while fetching reviews'});
        });
});

app.post('/postreplies', (req, res) => {
    const url = 'http://localhost:4753/api/reviewsdeposition';
    const body = {
        "_id": req.body._id,
        "reply": req.body.reply,
    }
    axios.post(url, body)
        .then(response => {
            res.status(200).json({message: response.data});
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: 'Error occurred while posting reviews'});
        });
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
}
);