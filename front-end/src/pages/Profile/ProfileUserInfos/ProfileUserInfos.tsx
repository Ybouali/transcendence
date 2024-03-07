import React, { useContext, useEffect, useState } from 'react'
import "./ProfileUserInfosStyle.css"
import { Tokens, UserType } from '../../../types';
import { getNumberGamePlayedByUserId, getTokensFromCookie, getUserById, getUserInfo, prepareUrl } from '../../../utils/utils';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../../components/Spinner/Spinner';
import { useConnectedUser } from '../../../context/ConnectedContext';

function ProfileUserInfos() {

  const { userId } = useParams();

  const { connectedUser } = useConnectedUser()

  const [userData, setUserData] = useState<UserType | null>();

  const [numberGamePlayed, setNumberGamePlayed] = useState<number>(0);

  useEffect(() => {

    initUserinfos()

  }, [setUserData, setNumberGamePlayed])

  const initUserinfos = async () => {

      // get the tokens
      const tokens: Tokens | null = await getTokensFromCookie();

      if (tokens && tokens.access_token && tokens.refresh_token) {

        setUserData(connectedUser)

        if (userId) {
          // the will be called because the url contains a user id
            const userById = await getUserById(userId, tokens);

            if (userById) {
              console.log(userById)
              setUserData(userById);
            }

        }

        // get the number of game played by the player
        const numberOfGames: number | null = await getNumberGamePlayedByUserId(userData?.id)
    
        if (!numberOfGames) {
          setNumberGamePlayed(0);
        } else {
          setNumberGamePlayed(numberOfGames);
        }
      }
  }

  

  return (
    <>
    { userData ? (
      <div className="profile-user-infos">

        <div className="profile-user-image">
          <img src={ prepareUrl("") + userData?.avatarUrl} alt="user image" />
        </div>

        <div className="profile-user-description">
          <div className="profile-user-fullname">{userData?.fullName}</div>
          <p className="profile-user-username">{userData?.username}</p>
          <p className="profile-user-status">{userData?.Status}</p>
        </div>

        <div className="profile-user-stats">
          <div className="stats-infos" id="friends">
            {/* hadi dyal abdlmoumen   */}
            <div className="stats-number">50</div>
            <p className="stats-title">Friends</p>
          </div>
          <div className="stats-infos" id="played-games">
            <div className="stats-number">{numberGamePlayed}</div>
            <p className="stats-title">Played games</p>
          </div>
          <div className="stats-infos" id="level">
            <div className="stats-number">{userData?.levelGame}</div>
            <p className="stats-title">Level</p>
          </div>
        </div>
      </div>

    ) : (
      <Spinner />
    )

    }
    </>
  )
}

export default ProfileUserInfos
