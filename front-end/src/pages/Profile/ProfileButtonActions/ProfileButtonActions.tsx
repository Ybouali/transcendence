import React, { useContext, useEffect, useState } from 'react'
import "./ProfileButtonActionsStyle.css"
import { useNavigate, useParams } from 'react-router-dom';
import { Tokens, UserType } from '../../../types';
import {  getIsFriend, getTokensFromCookie, getUserById, getUserInfo } from '../../../utils/utils';
import { useUser } from '../../../context/UserContext';
import { useConnectedUser } from '../../../context/ConnectedContext';


function ProfileButtonActions() {

  const navigate = useNavigate();

  const { connectedUser } = useConnectedUser()

  const { userId } = useParams();

  const [friend, setFriend] = useState<boolean>(false);

  const [userData, setUserData] = useState<UserType | null>();

  const [personal, setPersonal] = useState<boolean>(true);

  useEffect(() => {

    initData()

  }, [setUserData, setPersonal, setFriend])

  const initData = async () => {

    setUserData(connectedUser);

    const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens === null) {
      navigate('/error-page/:401');
      return ;
    }
    
    if (userId) {
      
      // the will be called because the url contains a user id
      if (userId === connectedUser?.id) {
        setPersonal(true);
        setUserData(connectedUser);
      } else {

        const otherUser: UserType | null = await getUserById(userId, tokens);

        setPersonal(false)

        const isFriend: string = (await getIsFriend(userId)).relation;

        if (isFriend === "friend") {
          setFriend(true);
        } else if (isFriend === "blocked") {
          navigate("/friends")
        } else {
          setFriend(false);
        }
        setUserData(otherUser)
      }


      
    }
    else {
      setPersonal(true);
    }
    
  }



  return (
    <>
      {personal && 
        // "personal-account"
        <div className="profile-actions" data-type="personal-account"></div>
      }
      {!personal && 
        <div className="profile-actions" data-type="friend-account">

          <div className="actions-buttons">
            {friend && 
              <>
                <button type="button" className="action-button button-active">
                  Chat
                </button>
                <button type="button" className="action-button button-active">
                  Play
                </button>
                <button type="button" className="action-button button-inactive">
                  Block
                </button>
              </>
            }

            {/* "others-account" */}
            {!friend && 
              <button type="button" className="action-button button-active">
                َAdd user
              </button>
            }


          </div>
        </div>
      }
    </>
    
  );
}

export default ProfileButtonActions
