import React, { useContext, useEffect, useState } from 'react'
import "./ProfileButtonActionsStyle.css"
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { UserType } from '../../../types';
import { getTokensFromCookie, prepareUrl } from '../../../utils/utils';
import { Player } from '../../Game/Game';
import { useConnectedUser } from '../../../context/ConnectedContext';

interface ProfileButtonActionsType {

  friend: boolean;
  setIsFriend: () => void;
  
  personal: boolean;
  userData: UserType | null;
}


function ProfileButtonActions(props: ProfileButtonActionsType) {
  
  const navigate = useNavigate();
  const { connectedUser, setConnectedUser } = useConnectedUser();

  const handleBlockUser = async () => {
      try {
          const tokens: any = await getTokensFromCookie();

          if (!tokens) {
              navigate("/notauth");
          }
            const response = await fetch(prepareUrl(`friend/block/${props?.userData?.id}`), {
            method: "POST", 
            headers: {
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
          },
          });

          const res = await response.json();

          if (res?.statusCode !== undefined) {
            throw new Error('An error occurred, Please try again.');
          }

          if (!response.ok){
            throw new Error('An error occurred, Please try again.');
          }
          navigate("/friends");
      } catch (error) {
        toast.error('An error occurred, Please try again.')
      }
  }

  const handleChatWithFriend = () => {
     
    // TODO: navigate to the chat page but i think u need to set a id of the user to chat with aba abdo
    
    navigate(`/chat/${props?.userData?.id}`);
  }

  const handlePlayWithFriend = async () => {
     
    // TODO: navigate to the game page but i think u need to set a id of the user to play with a hajar
      try {
        const tokens: any = await getTokensFromCookie();

        if (!tokens) {
            navigate("/notauth");
        }
        const response = await fetch(prepareUrl(`game/playwith/${props?.userData?.id}`), {
          method: "POST", 
          headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
          },
        });

      const res = await response.json();

      if (res?.statusCode !== 200) {
        throw new Error('An error occurred, Please try again.');
      }

      if (!response.ok){
        throw new Error('An error occurred, Please try again.');
      }
      // console.log('PlayFriend: ', connectedUser?.id);
      Player.emit("PlayFriend", {userId: connectedUser?.id});
      navigate(`/game/${props?.userData?.id}`);
  } catch (error) {
    toast.error('An error occurred, Please try again.')
  }
  }

  //useEffect(() => {
  //  console.log('isFriend:', props?.friend);
  //})

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
