import React from 'react'
import "./ProfileAchievementStyle.css"
import { ArchievementsType } from '../../../../types';

function ProfileAchievement(props: ArchievementsType) {

    const imageSrc = `./images/achievements/trophy-${props.stage}.svg`;

  return (
    <div className={`achievement ${props.isActive ? "active" : ""}`}>
        <div className="achievement-image">
            <img src={imageSrc} alt="trophy icon" />
        </div>
        <div className="achievement-title">
            Win <br />
            {props.title}
        </div>
    </div>
  )
}
export default ProfileAchievement
