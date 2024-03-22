
import { io, Socket } from "socket.io-client"
import './App.css'
import { useEffect, useState } from "react";
import './style/WaitingPage.css'
import { fromBack } from "./objects";

import { InitSetup } from './rander_scene';
import { Duel } from "./Duel";
import { useNavigate } from 'react-router-dom';


// import { useRef, useState } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

export const Player: Socket = io('http://localhost:3000', { autoConnect: true });
function SendData() {
  Player.emit("onJoinGame");
}

// function onVs(){
//   Player.emit("OneVSone")
// }
let room2:string;
function Test() {
  const [connect, setSocket] = useState(false)
  const [isWaiting, setWaiting] = useState(false)
  const [isStart, setStart] = useState(false)
  // const [isDuo, setDuo] = useState(false)
  const navigate = useNavigate();
  const [BposX, setPosX] = useState(0)
  const [BposY, setPosY] = useState(0)
  // const [userP, setP] = useState(false)
  useEffect(()=>{
  function isConnect() {
    Player.connected
    setSocket(true)
  }
  console.log("here")
  Player.on("connect", isConnect)
},[])
  Player.on("playerIsWaiting", (data: boolean) => {
    setWaiting(data)
  })

  Player.on("forRouting", (data:string)=>{
    console.log(data);
    room2  = data;
    

    console.log("###########" +  data)
})
Player.on("StartGame", (data: boolean) => {
    setWaiting(data)
    setStart(true)
    console.log("$$$$$$$$$$$" + room2);
    navigate("/{room2}")
  })
  Player.on("startGame", (dataX, dataY)=>{
    setPosX(dataX);
    setPosY(dataY);
    fromBack.posX = BposX;
    fromBack.posY = BposY;
  })

  // Player.on("vsOne", (data)=>{
  //   setDuo(data)
  // })
  console.log(isWaiting)

  return (
    <div>
      {!isStart ? (
        <div id="StartButton" className="StartButton">
          <button className="btn" onClick={SendData}>START GAME</button>
          {isWaiting ? (
            <div className="Try">waitingPage...</div>
          ) : (
            null // Render nothing if not waiting
          )}
        </div>
      ) : (
        <InitSetup />
      )}
    </div>
  );
}
export default Test;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import Test from './Test';
// import {InitSetup} from './rander_scene';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Main route */}
//         <Route path="/" element={<Test />} />

//         {/* Route with dynamic data */}
//         <Route path="/:data" element={<InitSetup />} />

//         {/* Redirection for unknown routes */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;