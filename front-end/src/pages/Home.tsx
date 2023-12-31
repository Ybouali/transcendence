import React from 'react'

function Home() {

    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get the value of a specific parameter
    const param1Value = urlParams.get('code');


  return (
    <div>
        <h1>{param1Value}</h1>
        Home is here haz tkhdam awalid 3la wladak HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
    </div>
  )
}

export default Home
