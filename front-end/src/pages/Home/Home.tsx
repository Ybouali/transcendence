import React from 'react'
import Showcase from './Showcase/Showcase'
import About from './About/About'
import Team from './Team/Team'
import Header from '../../components/Header/Header'

function Home() {

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
