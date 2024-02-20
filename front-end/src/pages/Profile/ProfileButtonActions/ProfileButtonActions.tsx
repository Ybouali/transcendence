import React, { useContext, useEffect, useState } from 'react'
import "./ProfileButtonActionsStyle.css"
import { useNavigate, useParams } from 'react-router-dom';
import { Tokens, UserType } from '../../../types';
import {  getTokensFromCookie, getUserById, getUserInfo } from '../../../utils/utils';
import { useUser } from '../../../context/UserContext';


function ProfileButtonActions() {

  const navigate = useNavigate();

  const { userId } = useParams();

  const [friend, setFriend] = useState<boolean>(false);

  const { user, fetchUser } = useUser()

  const [userData, setUserData] = useState<UserType | null>();

  const [personal, setPersonal] = useState<boolean>(true);

  useEffect(() => {

    initData()

  }, [])

  const initData = async () => {

    // setUserData(userDataCon);

    // console.log({ userData})

    // if (!userData) {
    //   navigate("/notauth")
    // }

    // const tokens: Tokens | null = await getTokensFromCookie();

    // if (tokens === null) {
    //   navigate('/notauth');
    //   return ;
    // }
    
    // if (userId) {
    //   // the will be called because the url contains a user id
    //   setUserData(await getUserById(userId, tokens))
    //   setPersonal(false);
    //   // here need to check if the user is a friend if is a friend so
    //   // setFriend(true);
    //   // if not a friend 
    //   // setFriend(false);
    // }
    // else {
    //   setPersonal(true);
    // }
    
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
