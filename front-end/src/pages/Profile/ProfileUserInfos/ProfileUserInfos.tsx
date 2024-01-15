import React, { useEffect, useState } from 'react'
import "./ProfileUserInfosStyle.css"
import { Tokens, UserType } from '../../../types';
import { getTokensFromLocalStorge, getUserById, getUserInfo } from '../../../utils/utils';
import { useNavigate, useParams } from 'react-router-dom';

function ProfileUserInfos() {

  const navigate = useNavigate();

  const { userId } = useParams();

  const [userData, setUserData] = useState<UserType>();

  useEffect(() => {

    initUserinfos();

  }, [])

  

  
  const initUserinfos = async () => {

    let userData: UserType | undefined = undefined;

    const tokens: Tokens = await getTokensFromLocalStorge();

    if (tokens.refresh_token === null || tokens.access_token === null) {
      navigate('/');
      return ;
    }
    
    if (userId) {
      // the will be called because the url contains a user id
      userData = await getUserById(userId, tokens);
    }
    
    console.log({
      userData
    })
    
    if (userData === undefined) {
      // this will be called because the url dose not contain a user id
      // and this is the default one aka display the user logged in info
      userData = await getUserInfo(tokens);
    }


    if (userData === undefined) {
      navigate('/');
      return;
    }

    setUserData(userData);
  }

  

  return (
    <div className="profile-user-infos">
      <div className="profile-user-image">
        <img src={userData?.avatarName} alt="user image" />
      </div>

      <div className="profile-user-description">
        <div className="profile-user-fullname">{userData?.fullName}</div>
        <p className="profile-user-username">{userData?.username}</p>
        <p className="profile-user-status">{userData?.isOnLine ? "Online" : "Offline"}</p>
      </div>

      <div className="profile-user-stats">
        <div className="stats-infos" id="friends">
          {/* hadi dyal abdlmoumen   */}
          <div className="stats-number">50</div>
          <p className="stats-title">Friends</p>
        </div>
        <div className="stats-infos" id="played-games">
          <div className="stats-number">20</div>
          <p className="stats-title">Played games</p>
        </div>
        <div className="stats-infos" id="level">
          <div className="stats-number">{userData?.levelGame}</div>
          <p className="stats-title">Level</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileUserInfos
