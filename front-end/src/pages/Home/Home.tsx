import React, { useEffect } from 'react'
import Showcase from './Showcase/Showcase'
import About from './About/About'
import Team from './Team/Team'
import Header from '../../components/Header/Header'
import { LoginType, Tokens } from '../../types'
import { useNavigate } from 'react-router-dom'
import { getTokensFromCookie, prepareUrl } from '../../utils/utils'
import axios from 'axios'

function Home(props: LoginType) {

  const navigate = useNavigate();

  useEffect( () => {

    logIn();
    
  }, [])

  const logIn = async () => {

    try {
      
      // get the tokens from the local storage
      const tokens: Tokens | null = await getTokensFromCookie();

      // check if the tokens is present in the cookie so you should redirect to the profile page
      if (tokens) {
        navigate("/profile");
      }

    } catch (error) {
      // console.log(error)
      return ;
    }
  }

  // const loginIntra = async () => {

  //   try {
      
  //     const url = prepareUrl("auth/42/");
    
  //     // make call to server to login with the intra 42
  //     window.location.href = url;

  //   } catch (error) {
  //     return ;
  //   }
  // }

  return (
    <>
      {/* <Header isConnected={false} logInFunc={loginIntra} /> */}
      {/* <Showcase isConnected={false} logInFunc={loginIntra} /> */}
      <Showcase logInFunc={props.logInFunc} />
      <About />
      <Team />
    </>
  )
}

export default Home
