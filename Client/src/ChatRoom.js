import React, { useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";
import io from 'socket.io-client';


export default function ChatRoom() {
  const [msgs, setMsgs] = useState([{}]);
  const message = useRef();
  const socketRef = useRef();
  let { id, username } = useParams();
  const scrollRef = useRef();
  
  useEffect(() => {
    socketRef.current = io.connect("http://127.0.0.1:5000/", {
      //  withCredentials: false,
      //  withCredentials: true,
      //  extraHeaders: {
      //      "name": "chatApp"
      //  }
    });
    socketRef.current.on("connect", () => {
      console.log(`socket connected : ${socketRef.current.connected}`);
      console.log(socketRef.current.id);
      socketRef.current.emit("loadmsgs", id);
    });
    socketRef.current.once("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
      alert('unable to connect to the server,\ntry checking your internet connection and reloading the page.');
    });
    socketRef.current.on("msgs", (data) => {
      if (data === null || data === undefined) {
        setMsgs([]);
      } else {
        setMsgs(data)
      }
      console.log(data);
    });
    socketRef.current.on("newmsg", (msg) => {
      // if (msgs === [] || msgs === null || msgs === undefined) {
        // setMsgs([msg]);
      // } else {
        setMsgs(m => m !== null || m !== undefined ? [...m, msg] : [msg]);
            // setMsgs(m => [...m,msg])
      // }
    });


    return () => {
      socketRef.current.disconnect();
    }
  }, [id]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [msgs]);


  return (
    <div>
      <br />
      <center><pre>{`Chat Room Code: ${id}`}</pre></center>
      <div className="ChatBox">
        <div className='messagesBox'>
          {msgs && msgs.map((msg, i) =>
            <div className='msgBlock' key={i}>
              <span>
                <strong>{msg.name}</strong>: {msg.message}
              </span>
            </div>)}
            <div ref={scrollRef}></div>
        </div>
        <div className='msgInput'>
          <form onSubmit={(e) => {
            e.preventDefault();
            // console.log(message.current.value);
            socketRef.current.emit("sendmsg", {"name": username, "message": message.current.value, "time": new Date().toLocaleString(), "id": id})
            message.current.value = "";

          }}>
          <input id='msgtextfield' type="text" ref={message} placeholder="Message..." autoComplete='off' />
          <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}