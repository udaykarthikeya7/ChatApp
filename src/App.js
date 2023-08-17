import './App.css';
import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react'
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { supabase } from './lib/helper/supabaseClient';

function App() {
	const [user, setUser] = useState(null)

	  const logout = async() => {
			await supabase.auth.signOut({
				provider: "github"
			})
  	}
	  useEffect(() => {
    // const getUser = async () => {
    //   const userdata = (await supabase.auth.getSession()).data?.session?.user;
    //   return userdata;
    // }
    supabase.auth.getSession()
    .then(({data, error}) => {
      data?.session && setUser(data.session.user);
			error && console.error(error);
    })
    
    const {data: authListener} = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case "SIGNED_IN":
					setUser(session?.user);
          break;
        case "SIGNED_OUT":
          setUser(null);
          break;
        default:
          break;
      }
    })
    return () => {
      authListener.subscription.unsubscribe();
    }
  }, [])

  return (
    <div className='App'>
      {!user ? (
			<div className='loginBox'>
			<Auth 
			supabaseClient={supabase} 
			appearance={{ theme: ThemeSupa }} 
			theme='dark'
			providers={['google', 'github']}/>
			</div>
			) : 
				(<div className='home'>
					<h1>Welcome Home</h1>
					<button onClick={logout}>Logout</button>
				</div>)}
    </div>
  )
}

// function App() {
//   const [user, setUser] = useState(null)
  
//   async function signInWithEmail(email, pass) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email: email.toString(),
//       password: password.toString(),
//     })
//   }

//   const login = async() => {
//     await supabase.auth.signInWithOAuth({
//       provider: "github"
//     })
//   }

//   const logout = async() => {
//     await supabase.auth.signOut({
//       provider: "github"
//     })
//   }

//   useEffect(() => {
//     // const getUser = async () => {
//     //   const userdata = (await supabase.auth.getSession()).data?.session?.user;
//     //   return userdata;
//     // }
//     supabase.auth.getSession()
//     .then(({data, error}) => {
//       data?.session && setUser(data.session.user);
//     })
    
//     const {data: authListener} = supabase.auth.onAuthStateChange(async (event, session) => {
//       switch (event) {
//         case "SIGNED_IN":
//           break;
//         case "SIGNED_OUT":
//           setUser(null);
//           break;
//         default:
//           break;
//       }
//     })
//     return () => {
//       authListener.subscription.unsubscribe();
//     }
//   }, [])
  

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Chat App</h1>
//       </header>
//       {user ? 
//       (<div>
//         <h1>Authenticated</h1>
//         <button onClick={logout}>logout</button>
//         </div>) : 
//       (<button onClick={login}>login with github</button>)}
//     </div>
//   );
// }

export default App;
