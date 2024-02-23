import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Tokens } from '../../types';
import { getTokensFromCookie } from '../../utils/utils';
import Header from '../../components/Header/Header';


function Chat() {

  const navigate = useNavigate();

  useEffect(() => {
    gaurd();
  })
  
  const gaurd = async () => {

    // if there is no tokens the user will be redirected to not auth page this will be the Gaurd

    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) {
      navigate("/notauth")
    }

  }


  return (
    <>
      <Header isConnected={true}  />
      Chat
    </>
  )
}

export default Chat
