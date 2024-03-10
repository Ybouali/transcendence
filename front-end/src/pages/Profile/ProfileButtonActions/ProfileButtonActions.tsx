import React, { useContext, useEffect, useState } from 'react'
import "./ProfileButtonActionsStyle.css"
import { Link, useNavigate } from 'react-router-dom';

interface ProfileButtonActionsType {

  friend: boolean;
  setIsFriend: () => void;

  personal: boolean;
}


function ProfileButtonActions(props: ProfileButtonActionsType) {
  
  const navigate = useNavigate();

  const handleBlockUser = () => {
    // TODO: send request to the backend to block a user 
    // navigate to the friend page
    navigate("/friends");
  }

  const handleChatWithFriend = () => {
     
    // TODO: navigate to the chat page but i think u need to set a id of the user to chat with aba abdo
    navigate("/chat");
  }

  const handlePlayWithFriend = () => {
     
    // TODO: navigate to the game page but i think u need to set a id of the user to play with a hajar
    navigate("/game");
  }

  return (
    <>
      {props.personal && 
        // "personal-account"
        <div className="profile-actions" data-type="personal-account"></div>
      }
      {!props.personal && 
        <div className="profile-actions" data-type="friend-account">

          <div className="actions-buttons">
            {props.friend && 
              <>
                <button onClick={handleChatWithFriend} type="button" className="action-button button-active">
                  Chat
                </button>
                <button onClick={handlePlayWithFriend} type="button" className="action-button button-active">
                  Play
                </button>
                <button onClick={handleBlockUser} type="button" className="action-button button-inactive">
                  Block
                </button>
              </>
            }

            {/* "others-account" */}
            {!props.friend && 
              <button onClick={props.setIsFriend} type="button" className="action-button button-active">
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
