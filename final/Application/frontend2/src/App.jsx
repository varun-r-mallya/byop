import './App.css'
import ShowReviews from './components/ShowReviews'
import { useState } from 'react';
import SentimentChart from './components/SentimentChart'
import Gauge from './components/Auto';

function App() {
  return (
    <div className='app'>
      <h1 style={{
        color: "white",
        textAlign: "left",
        fontSize: "2rem",
        fontFamily: "Roboto",
        fontWeight: "500",
        marginTop: "-2rem",
        marginBottom: "1rem",
        textShadow: "2px 2px 4px #000000",
        backgroundColor: "black",
        boxSizing: "border-box",
        width: "100%",
        display: "flex",
        justifyContent: "left",
        alignItems: "baseline",
        padding: "1em",
      }}>
        Reviewinator</h1>
        <h4 style={{color: "white", margin: "10px"}}>Dashboard</h4>
      <div style={{display: 'flex', flexDirection: 'row'}}>
      <ShowReviews  />
      <SentimentChart />
      
      </div>
      <Gauge />
    </div>
  )
}

export default App
