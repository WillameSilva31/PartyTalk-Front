import { useEffect, useState } from 'react';
import './App.css';
import { IoMdSend } from "react-icons/io";
import { TiWeatherWindyCloudy } from "react-icons/ti";
import socket from 'socket.io-client';
import bgN from './assets/vectorstock_37001775.png';

const io = socket("http://localhost:4000");

function App() {

  const [name, setName] = useState("");
  const [myId,setMyId] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages)


  useEffect(() => {
    io.on("users", (users) => { setUsers(users) })
    io.on("message", (message) => setMessages((messages) => [...messages, message]));
    io.on("connect", ()=>setMyId(io.id));
    }, [])

  const handleJoin = () => {
    if (name) {
      io.emit("join", name);
      setJoined(true);
    }
  }

  const handleMessage = () => {
    if (message) {
      io.emit("message", { message, name });
      setMessage("");
    }
  }

  if (!joined) {
    return (
      <div className='background_name' src={bgN}>
        <div className='input_Name'>
          <div className='head'>
            <div className='logo'>
              <TiWeatherWindyCloudy />
            </div>
          </div>
          <span className='Digite'>Digite seu nome</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className='input' />
          <button className="button-82-pushable" role="button" onClick={()=> handleJoin()}>
            <span className="button-82-shadow"></span>
            <span className="button-82-edge"></span>
            <span className="button-82-front text">
              ENTRAR
            </span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="Container">
      <div className='Background'></div>
      <div className='Chat_container'>



        <div className='Chat_Contact'>
          <div className='Contact_image'>
            <div className='Logo'>
              <TiWeatherWindyCloudy />
            </div>
          </div>
          <div className='Contact'>
            <div className='PartyTalk_Name'>
              <div id='PT'>PartyTalk</div>
              <div id='Last_Message'>
                {users.map((user, index) => (
                  <span className='Users' key={null}>{user.name}{index + 1 < users.length ? ", " : ""}</span>

                ))}
              </div>
            </div>
          </div>
        </div>



        <div className='Chat_Messages'>
          < div className='Chat_Messages_Area'>
            {messages.map((message, index) => (
              <div className={message.userId === myId ? "User_Container_Message L" : "User_Container_Message R"}>
                <span
                  className={message.userId === myId ? 'User_My_Message' : 'User_Others_Messages'}
                  key={index}
                >{message.name ? `${message.name}: ` : ''}{message.message}
                </span>
              </div>
            ))}
          </div>



          <div className='Chat_Input_Area'>
            <div className='Input_Area'>
              <input className='Input_Message' placeholder='Digite aqui...' value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className='Send_Message'>
              <div className='Send_Button' onKeyDown={(e)=> {
                if(e.key === "Enter"){
                  e.preventDefault();
                  handleMessage();
                }
              }} onClick={() => handleMessage()}>
                <IoMdSend />
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default App;