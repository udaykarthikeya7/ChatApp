import { supabase } from './lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function Home() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      async function getUserData() {
        await supabase.auth.getUser().then((value) => {
            if (value.data?.user) {
                console.log(value.data.user);
                setUser(value.data.user);
                setIsLoading(false);
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
            <h1>Welcome {user.email}</h1>
            <br />
            <div>
                <input type='text' placeholder='type message here' />
                <button type='submit'>submit</button>
            </div>
            <button onClick={logout}>Logout</button>
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