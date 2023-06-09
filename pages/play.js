import CanvasDraw from 'react-canvas-draw'
import React, {useState, useRef, useEffect} from "react"
import Layout from "../components/Layout";
import Image from "next/image"
import pen from "../components/assets/pen.png"
import Player from "../components/Player"
import eraser from "../components/assets/eraser.png"
import back from "../components/assets/back.png"

import io from 'socket.io-client'
let socket

const rs = ['#000000', '#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#A020F0'];
let index = 0;

const Canvas = () => {
  const [canvasData, setCanvasData] = useState()
  const canvas = useRef()
  const [color, setColor] = useState('')
  useEffect(() => socketInitializer(), [canvas])
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-canvas', newCanvas => {
        canvas.current.loadSaveData(newCanvas)
    })

    socket.on('update-color', sentColor => {
      console.log(canvas.current)
      setColor(sentColor)
    })
  }

  const onCanvasChange = (e) => {
    console.log("Bing chilling")
    socket.emit('canvas-change', e.getSaveData())
  }

  return (
    <CanvasDraw
      ref = {canvas}
      hideInterface={true}
      hideGrid={true}
      immediateLoading={false}
      lazyRadius={0}
      brushRadius={2}
      canvasWidth={350}
      canvasHeight={300}
      brushColor={color}
      disabled={false}
      onChange={onCanvasChange}
    />
  )
}

function Home() {
  const [chat, setChat] = useState(null)
  const [input, setInput] = useState('')

  const updateChat = (e) => {
    const { name, value } = e.target;
    setChat(value)
  }

  return (
    <div className="pt-[3.5rem] bg-blue-400 min-h-screen min-w-screen flex flex-col justify-center overflow-clip">
      <div className="flex flex-col items-center justify-center overscroll-contain">
        <Canvas/>
        <div className="flex w-[21.9rem] mt-2 h-12 bg-white">
            <button id="paint" className=" bg-black focus:ring-1 focus:ring-black focus:outline-none w-[3rem] p-4 border-2 rounded-md border-slate-100" onClick={()=>{
              index = index + 1;
              if(index === 7)
              {
                index = 0;
              }
              paint.style.backgroundColor = rs[index];
              socket.emit("color-change" , rs[index]);
            }}>
              
            </button>
            <button className="focus:ring-1 focus:ring-black focus:outline-none w-[3rem] p-2 ml-14 rounded-md border-slate-100" onClick={()=>{
              socket.emit("color-change" , rs[index]);
            }}>
              <Image src={pen} width={250} height={250}/>
            </button>
            <button className="focus:ring-1 focus:ring-black focus:outline-none w-[3rem] p-2 ml-14 rounded-md border-slate-100">
              <Image src={eraser} width={250} height={250}/>
              {/* Set the brush to white */}
            </button>
            <button className="focus:ring-1 focus:ring-black focus:outline-none w-[3rem] p-2 ml-14 rounded-md border-slate-100" onClick={()=>{
              socket.emit("color-change" , "white");
            }}>
              <Image src={back} width={250} height={250}/>
              {/* Go back one drawing */}
            </button>          
        </div>
        <div className="flex flex-row w-[21.9rem]">
          <div className="basis-1/2 bg-white mt-2 h-[200px]">
            <p>Players</p>
          </div>
          <div className="basis-1/2 ml-2 bg-white mt-2 h-[200px]">
            <p>CHAT</p>
          </div>
        </div>
        <div className="py-2">
          <input
            name="guess"
            value={chat}
            onChange={updateChat}
            required
            type="text"
            placeholder="guess here"
            className="focus:ring-1 focus:ring-black focus:outline-none w-[21.9rem] p-2 border-2 rounded-md border-slate-100"
            />
        </div> 
      </div>
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export default Home
