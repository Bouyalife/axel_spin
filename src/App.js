import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette'


export default  ()  => {
 
    // All names in the current wheel
  const[array, setArray] = useState([
  ]);

  const WebSocket = window.WebSocket;
  const [socket, setSocket] = useState(null);

  // Current input
  const [name, setName] = useState("");
  
  // If wheel is spinning
  const [mustSpin, setMustSpin] = useState(false);
  // Winning index
  const [prizeNumber, setPrizeNumber] = useState(0);

  useEffect(()=>{
    const socket = new WebSocket("wss://axelspin-backend.onrender.com");

    socket.onopen = () =>
    {
      setSocket(socket);
      console.log("Connected to server");
    }
    
    socket.onmessage = (resp) =>{
      console.log(resp.data);
      var splitMessage = resp.data.split(" ");
      if(splitMessage[0] === "spin")
      {
        setPrizeNumber(splitMessage[1]);
        setMustSpin(true);
      }
      if (splitMessage[0] === "name") 
      {
        setArray(oldArray => [...oldArray, {option: splitMessage[1]}]);
      }
      if(splitMessage[0] === "delete")
      {
        setArray(oldArray => oldArray.filter((index) => index.option !== splitMessage[1]));
      }
      if(splitMessage[0] === "names")
      {
        for(let i = 1; i < splitMessage.length; i++)
        {
          setArray(oldArray => [...oldArray, {option: splitMessage[i]}]);
        }
      }
    }
    return () => {
      socket.close();
    };
  },[]);

  const handleKeyDown = (event) =>
  {
    if(event.key === 'Enter')
    {
      socket.send("name " + name);
      setName("");
    }
  }

  function handleChange (event) {
    setName(event.target.value);
  }

  function deleteName (event) {
    socket.send("delete " + event.target.value);
  }

  const spinWheel = () =>
  {
    socket.send("spin");
  }

  const resetWheel = () =>
  {
    setMustSpin(false);
    socket.send("spindone");
  }

  const winner = array.find(item => item.option === prizeNumber);
  const winnerOption = winner ? winner.option : '';

  return (
    <>
    {array.length > 0 ? (<div>
    <Wheel
      mustStartSpinning={mustSpin}
      prizeNumber={prizeNumber}
      data={array}
      backgroundColors={['#3e3e3e', '#df3428']}
      textColors={['#ffffff']}
      onStopSpinning={resetWheel}
    /></div>)
    : null}
    
    {mustSpin ? null : <div>
    <button onClick={spinWheel}>Spin!</button>
      {array.map(index => <button value={index.option} onClick={deleteName}>{index.option}</button>)}
      <input type="text" onChange={handleChange} onKeyDown={handleKeyDown} value={name} placeholder='Enter name!'/>
      {array.length}
    </div> }
    
  </>
  );
}