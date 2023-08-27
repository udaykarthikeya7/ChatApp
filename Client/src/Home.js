import { supabase } from './lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState([]);
  const [createRoom, SetCreateRoom] = useState(true);
  // {"username": "uday", "message": "Hi There!"},{"username": "uday", "message": "Hi There!"},
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef();
  const nameRef = useRef();
  const roomRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
        if (value.data?.user) {
          console.log(value.data.user.email);
          setUser(value.data.user);
          setIsLoading(false);
          // fetch("http://127.0.0.1:5000/data")
          // .then(data => {return data.json()})
          // .then(resp => console.log(JSON.stringify(resp)))
          // .catch(console.log);
        } else {
          navigate("/login");
        }
      });
    }
    getUserData();
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
      });
      socketRef.current.once("connect_error", (err) => {
       console.log(`connect_error due to ${err.message}`);
       alert('unable to connect to the server,\ntry checking your internet connection and reloading the page.');
      });
      socketRef.current.on("message", (data) => {
        console.log(data);
        setRooms(data["rooms"]);
      //  console.log(data);
    //   //  if(data.length === 0) {
    //   //     console.log("no data");
    //   //     setLoading(false);
    //   //     setNotFound(true);

    //   //  }
    //   //  else {
    //   //     setmds(data.init);
    //   //     scoredispatch({ type: SCOREACTIONS.INIT, data: data.init});
    //   //     if (data.INN1) {
    //   //        scoredispatch({ type: SCOREACTIONS.SET, newdata: data.INN1});
    //   //        data.INN1.initChanged && setshowInitView(false);
    //   //     }
    //   //     setLoading(false);
    //   //     setNotFound(false);
    //   //  }
      })

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case "SIGNED_IN":
          navigate("/");
          break;
        case "SIGNED_OUT":
          navigate("/login");
          break;
        default:
          break;
      }
    });

    return () => {
      // socketRef.current.disconnect();
      authListener.subscription.unsubscribe();
    }
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
  }

  const handleButtonClick = () => {
    // Use navigate inside the event handler
    navigate('/');
  };
  const submit = (e) => {
    e.preventDefault();
    alert(nameRef.current.value, roomRef.current.value);
    if (!createRoom) {
      socketRef.current.emit("join", {"name": nameRef.current.value, code: roomRef.current.value});
    } else {
      socketRef.current.emit("create", {"name": nameRef.current.value});
    }

  }
  return (
    <div className='home'>
      {isLoading ? (
        <>
          <div className="loading-spinner"></div>
        </>
      ) :
        (user ? (
          <>
            <div id='emaillogout'>
              <h1>Welcome {user.email}</h1>
              <button id="logoutbutton" onClick={logout}>Logout</button>
            </div>
            <div className='joinbox'>
              <form onSubmit={submit} className="joinform">
                <pre>Enter The Chat Room</pre>
                <div>
                  <label>Name: </label>
                  <input
                    type="text"
                    placeholder="Pick a name!"
                    name="name"
                    ref={nameRef}
                  />
                </div>
                <label>
                    <input type='radio' checked={!createRoom} onChange={(e) => {
                      if (e.target.value === "on") {
                        SetCreateRoom(false);
                      } else {
                        SetCreateRoom(true);
                      }
                    }} />
                    Join Room
                  </label>
                  <label>
                    <input type='radio' checked={createRoom} onChange={(e) => {
                      if (e.target.value === "on") {
                        SetCreateRoom(true);
                      } else {
                        SetCreateRoom(false);
                      }
                    }} />
                    Create Room
                  </label>
                <div className="join">
                  <input type="text" disabled={createRoom} placeholder="Room Code" name="code" ref={roomRef} />
                  {/* <button type="submit" name="join">Join a Room</button> */}
                </div>
                {/* <button type="submit" name="create" class="create-btn">Create a Room</button> */}
                <button type="submit" name="create" className="create-btn">Submit</button>
                { error &&
                <ul>
                  <li>{ error }</li>
                </ul>
                }
              </form>
            </div>
            <div className='roomsBox'>
                {rooms && rooms.map((room,i) => {
                  <pre key={i}>room.name</pre>
                })}
            </div>
          </>) :
          (
            <>
              <h1>You are not logged in.</h1>
              <button onClick={handleButtonClick}>click here to login</button>
            </>
          ))}
    </div>
  )
}