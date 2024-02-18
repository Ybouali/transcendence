import React from 'react'
import Header from '../../components/Header/Header'
import "./LeaderboardStyle.css"
import Podum from './Podum/Podum'
import LeaderboardTable from './LeaderboardTable/LeaderboardTable'

function Leaderboard() {
  return (
    <div>
      {/* <Header isConnected={true}  /> */}
      <section className='profile' >
        <div className='container' >
          <Podum />
          <LeaderboardTable />
        </div>
      </section>
    </div>
  )
}

export default Leaderboard
