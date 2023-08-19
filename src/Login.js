import { Auth } from '@supabase/auth-ui-react'
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { supabase } from './lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    async function getUserData() {
      await supabase.auth.getUser().then((value) => {
          if (value.data?.user) {
              navigate("/");
          }
      });
    }
    getUserData();
  }, [navigate]);

	useEffect(() => {
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
    })
    return () => {
      authListener.subscription.unsubscribe();
    }
  }, [navigate]);

    return (
        <div className='loginBox'>
			<Auth 
			supabaseClient={supabase} 
			appearance={{ theme: ThemeSupa }} 
			theme='dark'
			providers={['google', 'github']}/>
		</div>
    )
}