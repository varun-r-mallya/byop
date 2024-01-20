import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App(){
    const [reviews, setReviews] = useState([]);
    const [myreview, setMyReview] = useState('');
    const [myrating, setMyRating] = useState(0);
    const reviewsContainerRef = useRef(null);

    function fetchReviews(){
      fetch('http://localhost:4753/reviews', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        scrollToBottom();
      })
    }
    
    
    useEffect(() => {
      fetchReviews();
    }, [])

    const submitHandler = (e) => {
      fetchReviews();
      e.preventDefault();
      sendReview();
      
    }

 
    function sendReview(){
      if(myreview === '' || myrating === 0){
        return;
      }
      fetch('http://localhost:4753/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          review: myreview,
          rating: myrating
        })
      })
      .then(res => res.json())
      .then(data => console.log(data))
    }

    function scrollToBottom() {
      const newReviewElement = reviewsContainerRef.current.lastElementChild;
      newReviewElement.scrollIntoView({ behavior: 'smooth' });
    }

    return(
      <div className='maindiv'>
        <h1>Reviewinator</h1>
        <div style={{ overflowY: 'scroll', maxHeight: '800px', width: '80vw' }} className='container' ref={reviewsContainerRef}>
          {reviews.map(review => {
            return (
              <div key={review._id} className='review'>
                <p className='review-text'>{review.review}</p>
                <p className='rating'>{review.rating}</p>
                <p className='reply'>{review.reply}</p>
              </div>
            )
          })}
          <div ref={reviewsContainerRef}></div>
        </div>
        <form onSubmit={submitHandler} className='former'>
        <input type="text" onChange={e => setMyReview(e.target.value)} placeholder='review' />
        <br />
        <input type="number" onChange={e => setMyRating(e.target.value)} placeholder='rating'/>
        <br />
        <input type="submit" value="Submit" />
        </form>
      </ div>
    )
}
