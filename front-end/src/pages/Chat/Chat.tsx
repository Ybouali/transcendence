import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useNavigate } from 'react-router-dom';
import { Tokens } from '../../types';
import { getTokensFromLocalStorge } from '../../utils/utils';


function Chat() {

  const navigate = useNavigate();

  useEffect(() => {

    logIn();
    
  }, [])

  const logIn = async () => {

    // get the tokens from the local storage
    const tokens: Tokens = await getTokensFromLocalStorge();

    // get the code in the url
    const url = new URL(window.location.href);
  
    const codeParam: string | null = url.searchParams.get('code');

    // check if the token already exists in the local storage
    if (tokens.refresh_token === null || tokens.access_token === null) {
      navigate('/');
      return;
    } else if (codeParam) {
  
      // login into the server
      loginServer(codeParam);

    }
  }

  const loginServer = async (code: string | null) => {

    // prepare the url
    
    // try {
      const url = `http://localhost:3333/auth/login/intranet/${code}`;
     
      // send a request to the server
      const resData: any = await fetch(url,
        {
          method: 'POST'
        }
      )
      .then(res => {
        // convert the data to json data and return it
        return res.json();
      })
      .catch(err => {
        console.error(err);  
      })
      
      // check if the server returns tokens or not
      if ( resData.refresh_token === undefined || resData.access_token === undefined) {
        navigate('/chat');
        return;
      }

      // store the token in the local storage
      localStorage.setItem('access_token', resData.access_token);
      localStorage.setItem('refresh_token', resData.refresh_token);

      return ;
  }


  return (
    <>
      <Header isConnected={true}  />
      Chat
    </>
  )
}

export default Chat
