'use client'

import {Axios} from "axios";
import { useEffect, useState } from "react";

export default function ShowReviews(){
    useClient();
    const [reviews, setReviews] = useState({})
     
    useEffect(() => {
        Axios.get("http://localhost:3001/getreviews")
            .then((res) => {
                setReviews(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    , []);
    
    return(
        <div>
            {reviews.map((review) => {
                return(
                    <div>
                        <p>{review.review}</p>
                        <p>{review.rating}</p>
                        <p>{review.reply}</p>
                    </div>
                )
            })
            }
        </div>
    )
}