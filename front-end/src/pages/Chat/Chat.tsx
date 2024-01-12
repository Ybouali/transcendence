import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useNavigate } from 'react-router-dom';


function Chat() {

  const navigate = useNavigate();

  useEffect(() => {

    // get the tokens from the local storage
    const refresh_token: string | null = localStorage.getItem('refresh_token');
    const access_token: string | null = localStorage.getItem('access_token');

    // check if the token already exists in the local storage
    if (refresh_token === undefined || access_token === undefined) {
      console.log("hello chat tokens")
      navigate('/');
      return;
    } else {

      // get the code in the url
      const url = new URL(window.location.href);
  
      const codeParam: string | null = url.searchParams.get('code');
  
      // if the code is not exist the user should provide a code for the intra
      if (!codeParam) {
        navigate('/');
        return ;
      }
  
      // login into the server
      loginServer(codeParam);

    }
    


  }, [])

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
    </>
  )
}

export default Chat
