import React, { useEffect, useState } from 'react'
import "./ProfileAchievementsStyle.css"
import ProfileAchievement from './ProfileAchievement/ProfileAchievement';
import { getNumberOfWinnedGames, getTokensFromLocalStorge, getUserById, getUserInfo } from '../../../utils/utils';
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
      let userData: UserType | undefined = undefined;

      const tokens: Tokens = await getTokensFromLocalStorge();

      if (tokens.refresh_token === null || tokens.access_token === null) {
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
        userData = await getUserInfo(tokens);
      }

      const nGameWinned: number = await getNumberOfWinnedGames(userData?.id)

      setNumberGameWinned(nGameWinned);
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
            stage={stage}
            title={title}
            isActive={isActive}
          />
        );
      })}
    </div>
  )
}

export default ProfileAchievements
