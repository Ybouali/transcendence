import React from 'react'
import Showcase from './Showcase/Showcase'
import About from './About/About'
import Team from './Team/Team'
import Header from '../../components/Header/Header'

function Home() {
  return (
    <>
      <Showcase />
      <About />
      <Team />
    </>
  )
}

export default Home
