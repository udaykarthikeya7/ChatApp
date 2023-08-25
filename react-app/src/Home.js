import { supabase } from './lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';


export default function Home() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const message = useRef();
    const navigate = useNavigate();
    useEffect(() => {
      async function getUserData() {
        await supabase.auth.getUser().then((value) => {
            if (value.data?.user) {
                console.log(value.data.user);
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

      const {data: authListener} = supabase.auth.onAuthStateChange(async (event, session) => {
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
        authListener.subscription.unsubscribe();
      }
    }, [navigate]);    
    
    const logout = async() => {
        await supabase.auth.signOut();
    }

    const handleButtonClick = () => {
        // Use navigate inside the event handler
        navigate('/');
      };

    return (
        <div className='home'>
            { isLoading ? (
                <>
                <div className="loading-spinner"></div>
                </>
            ) :
            (user ? (
            <>
            <div id='emaillogout'>
            <h1>Welcome {user.email}</h1>
            <button className="buttons" onClick={logout}>Logout</button>
            </div>
            <div className="ChatBox">
              <div className='msgBlock'>
                <div className='username'>
                <p>user1</p>
                </div>
                <div className="message">
                  message
                </div>
              </div>
              <div className='msgBlock'>
                <div className='username'>
                <p>user1</p>
                </div>
                <div className="message">
                  message
                </div>
              </div>
              <div className='msgBlock'>
                <div className='username'>
                <p>user1</p>
                </div>
                <div className="message">
                  message
                </div>
              </div>
              <div className='msgBlock'>
                <div className='username'>
                <p>user1</p>
                <div className="message">
                  message
                </div>
                </div>
              </div>
              <div className='msgInput'>
                <input type="text" ref={message} placeholder="Message..." autoComplete='false' />
                <button onClick={() => {
                  console.log(message.current.value);
                  message.current.value = "";
                  
                }}>Send</button>
              </div>
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