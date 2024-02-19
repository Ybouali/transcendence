import React, { useContext, useEffect, useState } from 'react'
import "./ProfileUserInfosStyle.css"
import { Tokens, UserType } from '../../../types';
import { getNumberGamePlayedByUserId, getTokensFromCookie, getUserById, getUserInfo } from '../../../utils/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';

function ProfileUserInfos() {

  const navigate = useNavigate();

  const { userId } = useParams();

  const { user, fetchUser } = useUser()

  const [numberGamePlayed, setNumberGamePlayed] = useState<number>(0);

  const [desplayedUser, setDesplayedUser] = useState<UserType | null>(null);

  useEffect(() => {
 
    fetchUser()

    initUserinfos()

  }, [fetchUser])

  

  
  const initUserinfos = async () => {
    
    console.log({
      user
    })

    // make sure there is a user logged in
    // if (user === null) {
    //   navigate('/notauth');
    // } else {

      setDesplayedUser(user);

      // get the tokens
      const tokens: Tokens | null = await getTokensFromCookie();
  
      if (tokens) {
    
        if (userId) {
          // the will be called because the url contains a user id

          const userById = await getUserById(userId, tokens);

          if (userById) {
            setDesplayedUser(userById);
          }

        }

        // get the number of game played by the player
        const numberOfGames: number | null = await getNumberGamePlayedByUserId(desplayedUser?.id)
    
        if (!numberOfGames) {
          setNumberGamePlayed(0);
        } else {
          setNumberGamePlayed(numberOfGames);
        }
    
    
        // if (userData === undefined) {
        //   navigate('/');
        //   return;
        // }
    
        // setUserData(userData);
      }


    // }
  }

  

  return (
    <div className="profile-user-infos">
      <div className="profile-user-image">
        <img src={ `http://localhost:3333` + desplayedUser?.avatarNameUrl} alt="user image" />
      </div>

      <div className="profile-user-description">
        <div className="profile-user-fullname">{desplayedUser?.fullName}</div>
        <p className="profile-user-username">{desplayedUser?.username}</p>
        <p className="profile-user-status">{desplayedUser?.isOnLine ? "Online" : "Offline"}</p>
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
          <div className="stats-number">{desplayedUser?.levelGame}</div>
          <p className="stats-title">Level</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileUserInfos
