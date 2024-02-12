import React, { useEffect } from 'react'
import Showcase from './Showcase/Showcase'
import About from './About/About'
import Team from './Team/Team'
import Header from '../../components/Header/Header'
import { Tokens } from '../../types'
import { useNavigate } from 'react-router-dom'
import { getTokensFromSessionStorage } from '../../utils/utils'
import axios from 'axios'

function Home() {

  const navigate = useNavigate();

  useEffect( () => {

    logIn();
    
  }, [])

  const logIn = async () => {

    try {
      
      // get the tokens from the local storage
      const tokens: Tokens | null = await getTokensFromSessionStorage();

      // get the code in the url
      const url = new URL(window.location.href);
    
      const codeParam: string | null = url.searchParams.get('code');

      // check if the token already exists in the local storage
      if (tokens && tokens.access_token && tokens.refresh_token) {
        navigate('/profile');
        return ;
      } else if (codeParam) {
        // login into the server
        await loginServer(codeParam);

      }

    } catch (error) {
      // console.log(error)
      return ;
    }
  }

  const loginServer = async (code: string | null) => {

    // prepare the url
    
    // if (code) {
    
      try {
        
        const url = `http://localhost:3333/auth/42/`;
    
        // send a request to the server
        const resData = await axios.get(url, {
          timeout: 2000
        });

        console.log("hello world", resData.data);
        
        if (resData.data) {

          // store the token in the session storage
          sessionStorage.setItem('access_token', resData.data.access_token);
          sessionStorage.setItem('refresh_token', resData.data.refresh_token);

          navigate('/profile')
        }
        else {
          navigate('/notauth');
        }

      } catch (error) {
        return;
      }
    // }

    return ;
  }

  const loginIntra = async () => {

    const intraUrl: string | undefined = process.env.REACT_APP_INTRA_42_LINK;
    

    if (intraUrl) {
      window.location.href = intraUrl;
    }
  }

  return (
    <>
      <Header isConnected={false} logInFunc={loginIntra} />
      <Showcase isConnected={false} logInFunc={loginIntra} />
      <About />
      <Team />
    </>
  )
}

export default Home
