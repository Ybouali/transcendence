import React, { useEffect } from 'react'
import "./LeaderboardStyle.css"
import Podum from './Podum/Podum'
import LeaderboardTable from './LeaderboardTable/LeaderboardTable'
import { useNavigate } from 'react-router-dom'
import { Tokens } from '../../types'
import { getTokensFromCookie } from '../../utils/utils'
import Header from '../../components/Header/Header'
import { useConnectedUser } from '../../context/ConnectedContext'

function Leaderboard() {

  const navigate = useNavigate();

  const { connectedUser } = useConnectedUser();

  useEffect(() => {
    gaurd();
  })
  
  const gaurd = async () => {

    // if there is no tokens the user will be redirected to not auth page this will be the Gaurd
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) {
      navigate("/notauth")
    }

    if (connectedUser?.twoFactor && connectedUser?.towFactorToRedirect) {
      navigate("/tow-factor")
    }
  }

  return (
    <div>
      <Header isConnected={true}  />
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
