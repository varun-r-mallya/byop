const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/reviewDB');

const reviewSchema = new mongoose.Schema({
    review: String,
    rating: Number,
    reply: String,
});

const Review = mongoose.model('Review', reviewSchema);

app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.post('/reviews', async (req, res) => {
    const review_new =await new Review({
        review: req.body.review,
        rating: req.body.rating,
    });

    review_new.save()
        .then(async () => {
            const reply = await Review.find();
            try {
                axios.post('http://127.0.0.1:5000/', reply);
            } catch (err) {
                console.log(err);
            }
            res.json({
                message: 'Review saved successfully'
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/api/reviewscollection', async (req, res) => {
        const reply = await Review.find();
        res.status(200).json(reply);
});
app.post('/api/reviewsdeposition', async (req, res) => {
        try {
            const reviews = req.body;
            await Promise.all(reviews.map(async (review) => {
                console.log(review._id, review.reply)
                await Review.findByIdAndUpdate(review._id, {
                    reply: review.reply,
                });
            }));
            res.status(200).json({ message: 'Reviews updated successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
});

app.listen(4753, () => {
    console.log('Server is running on port 4753');
});