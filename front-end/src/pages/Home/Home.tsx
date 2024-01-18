import React, { useEffect } from 'react'
import Showcase from './Showcase/Showcase'
import About from './About/About'
import Team from './Team/Team'
import Header from '../../components/Header/Header'
import { getTokensFromLocalStorge } from '../../utils/utils'
import { Tokens } from '../../types'
import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate();

  useEffect(() => {

    logIn();
    
  }, [])

  const logIn = async () => {

    // get the tokens from the local storage
    const tokens: Tokens | null = await getTokensFromLocalStorge();

    // get the code in the url
    const url = new URL(window.location.href);
  
    const codeParam: string | null = url.searchParams.get('code');

    // check if the token already exists in the local storage
    if (tokens && tokens.access_token && tokens.refresh_token) {
      navigate('/profile');
      return ;
    } else if (codeParam) {
      // login into the server
      loginServer(codeParam);

    }
  }

  const loginServer = async (code: string | null) => {

    // prepare the url
    
    if (code) {
      const url = `http://localhost:3333/auth/login/intranet/${code}`;
    
      let resData = null;

      // send a request to the server
      resData = await fetch(url,
        {
          method: 'POST'
        }
      )
      .then(res => {
        // convert the data to json data and return it
        return res.json();
      })
      .catch(err => {
        // console.error(err);
        // navigate('/notauth');
        return null;
      })


      
      // check if the server returns tokens or not
      // if ( !resData.refresh_token || !resData.access_token) {
      //   navigate('/notauth');
      //   return;
      // }

      if (resData) {
        // store the token in the local storage
        localStorage.setItem('access_token', resData.access_token);
        localStorage.setItem('refresh_token', resData.refresh_token);

        setTimeout(() => navigate('/profile'), 1000);
      }
    }

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
