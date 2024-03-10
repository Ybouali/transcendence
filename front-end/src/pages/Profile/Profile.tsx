import React, { useEffect, useState } from 'react'
import "./ProfileStyle.css"
import ProfileUserInfos from './ProfileUserInfos/ProfileUserInfos'
import ProfileButtonActions from './ProfileButtonActions/ProfileButtonActions'
import ProfileAchievements from './ProfileAchievements/ProfileAchievements'
import { HistoryGameReturnedType, Tokens, UserType } from '../../types'
import GamesHistory from './GamesHistory/GamesHistory'
import { useNavigate, useParams } from 'react-router-dom'
import { getHisGamesByUserId, getIsFriend, getNumberGamePlayedByUserId, getNumberOfWinnedGames, getTokensFromCookie, getUserById } from '../../utils/utils'
import { useConnectedUser } from '../../context/ConnectedContext'


function Profile() {

  const navigate = useNavigate();

  const { userId } = useParams();

  const { connectedUser } = useConnectedUser()

  const [userData, setUserData] = useState<UserType | null>(null);

  const [numberGamePlayed, setNumberGamePlayed] = useState<number>(0);

  const [numberFrined, setNumberFrined] = useState<number>(0);

  const [personal, setPersonal] = useState<boolean>(true);

  const [friend, setFriend] = useState<boolean>(false);

  const [numberGameWinned, setNumberGameWinned] = useState<number>(0)

  const [dataHisGame, setDataHisGame] = useState<HistoryGameReturnedType [] | []>([]);

  useEffect(() => {

    gaurd();
  }, [setUserData, setNumberGamePlayed, setFriend, setPersonal, setNumberGameWinned, setDataHisGame ]);
  
  const gaurd = async () => {

    // if there is no tokens the user will be redirected to not auth page this will be the Gaurd
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens || !tokens.access_token || !tokens.refresh_token) {
      navigate("/error-page/:401")
    }

    if (connectedUser?.twoFactor && connectedUser?.towFactorToRedirect) {
      navigate("/tow-factor")
    }

    await initData(tokens);
  }

  const initData = async (tokens: Tokens | null) => {

    if (tokens && tokens.access_token && tokens.refresh_token) {

      setUserData(connectedUser)

      if (userId) {

        // the will be called because the url contains a user id
        if (userId === connectedUser?.id) {
          setPersonal(true);
          setUserData(connectedUser);
        } else {

          const otherUser: UserType | null = await getUserById(userId, tokens);

          if (otherUser) {

            setPersonal(false)
  
            setUserData(otherUser);

          }

          const isFriend: string = (await getIsFriend(userId, tokens)).relation;

          if (isFriend === "friend") {
            setFriend(true);
          } else if (isFriend === "blocked") {
            navigate("/friends")
          } else if (isFriend === "isnotfriend") {
            setFriend(false);
          } else {
            navigate("/error-page/:404")
          }
        }


      } else {
        setPersonal(true);
      }

      // get the number of game played by the player
      const numberOfGames: number | null = await getNumberGamePlayedByUserId(userData?.id, tokens)
  
      if (!numberOfGames) {
        setNumberGamePlayed(0);
      } else {
        setNumberGamePlayed(numberOfGames);
      }

      // get the number of friends by id by default right now will be 0 
      const numberOfFriends: number | null = 0;

      if (!numberOfFriends) {
        setNumberFrined(0);
      } else {
        setNumberFrined(numberOfFriends);
      }

      const nGameWinned: number | null = await getNumberOfWinnedGames(userData?.id, tokens)
  
      if (nGameWinned) {
        setNumberGameWinned(nGameWinned);
      }

      if (userData?.id) {
        await getDatahistoryGames(userData.id, tokens)
      }
    }

  }

  const handleClickAddFriend = () => {

    // TODO: need to call the endpoint to add a friend

    setFriend(true);

  }

  const getDatahistoryGames = async (userId: string | null, tokens: Tokens) => {

    let data: HistoryGameReturnedType [] | null = null;

    try {

      if (userId) {
        data = await getHisGamesByUserId(userId, tokens);
      } else {
        
        data = await getHisGamesByUserId(null, tokens);
      }

      if (Array.isArray(data)) {
        setDataHisGame(data);
      }
      else {
        setDataHisGame([]);
      }
    } catch (error) {
      setDataHisGame([]);
    }
  }

  return (
    <>
      <section className="profile">
        <div className="container">
          <div className="profile-content" data-status="online">
            <ProfileUserInfos userData={userData} numberGamePlayed={numberGamePlayed} numberFrined={numberFrined} />
            <ProfileButtonActions friend={friend} personal={personal} setIsFriend={handleClickAddFriend} />
            <ProfileAchievements numberGameWinned={numberGameWinned} />
            <GamesHistory dataHisGame={dataHisGame} /> 
          </div>
        </div>
      </section>
    </>
  )
}

export default Profile
