import React from 'react'
import "./ProfileAchievementStyle.css"

function ProfileAchievement({ index, title, isActive }) {

    const imageSrc = `./images/achievements/trophy-${index}.svg`;

  return (
    <div className={`achievement ${isActive ? "active" : ""}`}>
        <div className="achievement-image">
            <img src={imageSrc} alt="trophy icon" />
        </div>
        <div className="achievement-title">
            Win <br />
            {title}
        </div>
    </div>
  )
}

export default ProfileAchievement
