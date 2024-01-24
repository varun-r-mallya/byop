import axios from "axios"
import { useEffect, useState } from "react"
import { Chart } from 'react-google-charts';

export default function SentimentChart(){
    const [sentiment, setSentiment] = useState([])
    useEffect(() => {
        axios
            .get("http://localhost:3001/panelsenti")
            .then((res) => {
                const count = res.data.sentiment;
                let happy = 0;
                let sad = 0;
                let neutral = 0;
                count.map(elem => {
                    switch(elem.sentiment){
                        case '1':
                            {
                                happy++;
                                break;
                            }
                        case '0':
                            {
                                neutral++;
                                break;
                            }
                        case '-1':
                            {
                                sad++;
                                break;
                            }
                    }
                })
                setSentiment(
                    [
                        ['Sentiment', 'Number'],
                        ['Happy', happy],
                        ['Sad', sad],
                        ['Neutral', neutral]
                    ]
                )
                
            })
            .catch((err) => {
                console.log(err);
            });
    }
    ,[])
    
    return (
        <div className='py-10 flex flex-col items-center justify-center'>
            <Chart
                chartType="BarChart"
                data={sentiment}
                style={{backgroundColor: "transparent"}}
            />
        </div>
    )
}