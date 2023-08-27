import React, { useState, useRef, useEffect } from 'react'

export default function ChatRoom({roomid}) {
    const [msgs, setMsgs] = useState([]);
    const message = useRef();
    return (
        <div className="ChatBox">
              <div className='messagesBox'>
                {msgs && msgs.map((msg,i) => 
                  <div className='msgBlock' key={i}>
                    <div className='username'>
                    <p>{msg.username}</p>
                    </div>
                    <div className="message">
                    {msg.message}
                    </div>
                  </div>)}
              <div className='msgBlock'>
                <div className='username'>
                <p>user1</p>
                </div>
                <div className="message">
                  message
                </div>
              </div>
              </div>
              <div className='msgInput'>
                <input id='msgtextfield' type="text" ref={message} placeholder="Message..." autoComplete='false' />
                <button onClick={() => {
                  console.log(message.current.value);
                  message.current.value = "";
                  
                }}>Send</button>
              </div>
            </div>
    );
}