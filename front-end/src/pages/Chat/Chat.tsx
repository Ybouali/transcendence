import React, { useEffect } from 'react'
import Header from '../../components/Header/Header'
import { useNavigate } from 'react-router-dom';

function Chat() {

  const navigate = useNavigate();


  useEffect(() => {
    const url = new URL(window.location.href);

    const codeParam: string | null = url.searchParams.get('code');

    if (!codeParam) {
      navigate('/');
    }

    loginServer(codeParam);


  }, [])

  const loginServer = async (code: string | null) => {

    try {

      const url = `http://localhost:3333/auth/login/intranet/${code}`;
      
      console.log("-------------------------------------------------", { url })
      const res = await fetch(url, 
        {
          method: 'POST'
        }
      )

      console.log("-------------------------------------------------")

      if (!res.ok) {
        navigate('/');
      }

      const resData: any = await res.json();

      console.log({
        resData
      })


    } catch (error) {
      console.log({ error })
    }
  }


  return (
    <>
      <Header isConnected={true} />
    </>
  )
}

export default Chat
