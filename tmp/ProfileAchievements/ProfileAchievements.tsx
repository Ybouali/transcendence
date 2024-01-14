import React from 'react'
import "./ProfileAchievementsStyle.css"
import ProfileAchievement from './ProfileAchievement/ProfileAchievement';

function ProfileAchievements({ winnedGames }) {

    const levels = [1, 2, 3, 4, 5, 6, 7, 20];
    const levelsLength = levels.length;
  return (
    <div className="profile-achievements">
      {levels.map((level, index) => {
        const stage = index + 1;
        let isActive = false;
        if (winnedGames >= level) {
          isActive = true;
        }
        const title =
          levelsLength - 1 === index ? `${level}+` : `${level} match`;
        return (
          <ProfileAchievement
            key={stage}
            index={stage}
            title={title}
            isActive={isActive}
          />
        );
      })}
    </div>
  )
}

export default ProfileAchievements
