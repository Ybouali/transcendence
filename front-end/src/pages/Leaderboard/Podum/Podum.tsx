import React, { useEffect, useState } from 'react'
import "./PodumStyle.css"
import { LeaderBoardType } from '../../../types'
import { getLeaderboardOfPlayers, prepareUrl } from '../../../utils/utils';
import { Link } from 'react-router-dom';

function Podum() {

  const [ dataLeaderBoard, setDataLeaderBoard ] = useState< LeaderBoardType [] | null>(null);

  useEffect(() => {
    
    initData();

  }, [setDataLeaderBoard])

  const initData = async () => {

    const data: LeaderBoardType [] | null = await getLeaderboardOfPlayers()

    console.log(data);
    
    setDataLeaderBoard(data);
  }

  return (
    <> 
        <div className="podium">
      { dataLeaderBoard && (
          <>
            { dataLeaderBoard.length >= 2 && (
              <div className="level-2">
                <div className="leadboard-card">
                  <div className="leadboard-card-content">
                    <div className="leadboard-image">
                      <img src={prepareUrl("") + dataLeaderBoard[1].avatarUrl} alt={dataLeaderBoard[1].username} /> 
                    </div>
                    <div className="leadboard-infos">
                      <Link to={`/profile/${dataLeaderBoard[1].id}`} className="leadboard-username">
                        {dataLeaderBoard[1].username}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="stage"></div>
              </div>
            )}

            {dataLeaderBoard.length >= 1 && (

              <div className="level-1">
                <div className="leadboard-card">
                  <div className="leadboard-card-content">
                    <div className="leadboard-image">
                      <img src={prepareUrl("") + dataLeaderBoard[0].avatarUrl} alt={dataLeaderBoard[0].username} />
                    </div>
                    <div className="leadboard-infos">
                      <Link to={`/profile/${dataLeaderBoard[0].id}`} className="leadboard-username">
                        {dataLeaderBoard[0].username}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="stage"></div>
              </div>

            )}
            
            { dataLeaderBoard.length >= 3 && (
              <div className="level-3">
                <div className="leadboard-card">
                  <div className="leadboard-card-content">
                    <div className="leadboard-image">
                    <img src={prepareUrl("") + dataLeaderBoard[2].avatarUrl} alt={dataLeaderBoard[2].username} /> 
                    </div>
                    <div className="leadboard-infos">
                      <Link to={`/profile/${dataLeaderBoard[2].id}`} className="leadboard-username">
                        {dataLeaderBoard[2].username}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="stage"></div>
              </div>
            )}
          </>
      )}
      </div>
    
    </>
  )
}

export default Podum
