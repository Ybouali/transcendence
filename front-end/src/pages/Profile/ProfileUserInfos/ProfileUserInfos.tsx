import React, { useContext, useEffect, useState } from 'react'
import "./ProfileUserInfosStyle.css"
import { Tokens, UserType } from '../../../types';
import { getNumberGamePlayedByUserId, getTokensFromCookie, getUserById, getUserInfo } from '../../../utils/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import Spinner from '../../../components/Spinner/Spinner';

function ProfileUserInfos() {

  const navigate = useNavigate();

  const { userId } = useParams();

  const { user, fetchUser } = useUser()

  const [numberGamePlayed, setNumberGamePlayed] = useState<number>(0);

  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [desplayedUser, setDesplayedUser] = useState<UserType | null>(null);

  useEffect(() => {
 
    fetchUser()

    initUserinfos()

  }, [fetchUser])

  

  
  const initUserinfos = async () => {

      // get the tokens
      const tokens: Tokens | null = await getTokensFromCookie();
  
      if (tokens) {
    
        if (userId) {
          // the will be called because the url contains a user id

          const userById = await getUserById(userId, tokens);

          if (userById) {
            setOtherUser(userById);
          }

        }

        // get the number of game played by the player
        const numberOfGames: number | null = await getNumberGamePlayedByUserId(desplayedUser?.id)
    
        if (!numberOfGames) {
          setNumberGamePlayed(0);
        } else {
          setNumberGamePlayed(numberOfGames);
        }
      }
  }

  

  return (
    <>
    { user ? (
      <div className="profile-user-infos">

        <div className="profile-user-image">
          <img src={ `http://localhost:3333` + user?.avatarName} alt="user image" />
        </div>

        <div className="profile-user-description">
          <div className="profile-user-fullname">{user?.fullName}</div>
          <p className="profile-user-username">{user?.username}</p>
          <p className="profile-user-status">{user?.isOnLine ? "Online" : "Offline"}</p>
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
            <div className="stats-number">{user?.levelGame}</div>
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
