import React, { useEffect, useState } from 'react'
import "./ProfileAchievementsStyle.css"
import ProfileAchievement from './ProfileAchievement/ProfileAchievement';
import { getNumberOfWinnedGames, getTokensFromCookie, getUserById, getUserInfo } from '../../../utils/utils';
import { Tokens, UserType } from '../../../types';
import { useNavigate, useParams } from 'react-router-dom';

function ProfileAchievements() {

  const { userId } = useParams()

  const navigate = useNavigate()

  const [numberGameWinned, setNumberGameWinned] = useState<number>(0)

  useEffect(() => {

    initData()

  }, [])


    const initData = async () => {
      let userData: UserType | null = null;

      const tokens: Tokens | null = await getTokensFromCookie();

      if (tokens === null) {
        navigate('/');
        return ;
      }
      
      if (userId) {
        // the will be called because the url contains a user id
        userData = await getUserById(userId, tokens);
      }
      
      if (userData === undefined) {
        // this will be called because the url dose not contain a user id
        // and this is the default one aka display the user logged in info
        userData = await getUserInfo();
      }

      const nGameWinned: number | null = await getNumberOfWinnedGames(userData?.id)

      if (nGameWinned) {
        setNumberGameWinned(nGameWinned);
      }
    }


    const levels = [1, 2, 3, 4, 5, 6, 7, 20];
    const levelsLength = levels.length;
  return (
    <div className="profile-achievements">
      {levels.map((level, index) => {
        const stage: number = index + 1;
        let isActive: boolean = false;
        if (numberGameWinned >= level) {
          isActive = true;
        }
        const title: string =
          levelsLength - 1 === index ? `${level}+` : `${level} match`;
        return (
          <ProfileAchievement
            key={stage}
            stage={level}
            title={title}
            isActive={isActive}
          />
        );
      })}
    </div>
  )
}

export default ProfileAchievements
