import React, { useEffect, useState } from 'react'
import "./ProfileButtonActionsStyle.css"
import { useNavigate, useParams } from 'react-router-dom';
import { Tokens, UserType } from '../../../types';
import { getTokensFromSessionStorage, getUserById, getUserInfo } from '../../../utils/utils';


function ProfileButtonActions() {

  const navigate = useNavigate();

  const { userId } = useParams();

  const [friend, setFriend] = useState<boolean>(false);

  const [personal, setPersonal] = useState<boolean>(true);

  useEffect(() => {

    initData();

  }, [])

  const initData = async () => {
    let userData: UserType | null = null;

    const tokens: Tokens | null = await getTokensFromSessionStorage();

    if (tokens === null) {
      navigate('/');
      return ;
    }
    
    if (userId) {
      // the will be called because the url contains a user id
      userData = await getUserById(userId, tokens);
      setPersonal(false);
      // here need to check if the user is a friend if is a friend so
      // setFriend(true);
      // if not a friend 
      // setFriend(false);
    }
    
    if (userData === undefined) {
      // this will be called because the url dose not contain a user id
      // and this is the default one aka display the user logged in info
      userData = await getUserInfo();
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
