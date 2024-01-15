import React from 'react'
import "./ProfileButtonActionsStyle.css"


function ProfileButtonActions({ action }) {
  // HERE YOU SHOULD TEST FOR THE IDS IF THE IT IS A PROFILE ACCOUNT OR FRIEND ACCOUNT OR OTHERS ACCOUNT
  switch (action) {
    case "friend-account":
      return (
        <div className="profile-actions" data-type="friend-account">
          <div className="actions-buttons">
            <button type="button" className="action-button button-active">
              Chat
            </button>
            <button type="button" className="action-button button-active">
              Play
            </button>
            <button type="button" className="action-button button-inactive">
              Block
            </button>
          </div>
        </div>
      );
    case "others-account":
      return (
        <div className="profile-actions" data-type="others-account">
          <div className="actions-buttons">
            <button type="button" className="action-button button-active">
              َAdd user
            </button>
          </div>
        </div>
      );
    default:
      return (
        <div className="profile-actions" data-type="personal-account"></div>
      );
  }
}

export default ProfileButtonActions
