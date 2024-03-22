import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import "./PlayersStyles.css";
import PlayerCard from "../player-card/PlayerCard";
import PulsedCard from "../pulsed-card/PulsedCard";
import { useConnectedUser } from '../../../context/ConnectedContext';
import { getTokensFromCookie, getUserById } from "../../../utils/utils";
import { Tokens, UserType } from "../../../types";
import { Player } from "../Game";
import { Duel } from "../Duel";

const Players: React.FC = () => {
  const { connectedUser, setConnectedUser } = useConnectedUser();

  	// GET THE CURRENT PAGE LOCATION
	const location = useLocation();

  const {id} = useParams();
  const [playerOne, setPlayerOne] = useState<any>(null);
  const [playerTwo, setPlayerTwo] = useState<any>(null);
  const navigate = useNavigate();

  const [isDuo, setDuo] = useState(false)

  useEffect(() => {

    // gaurd();
  }, []);
  
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

  function onVs() {
    Player.emit("OneVSone")
  }


  const initData = async (tokens: Tokens | null) => {

    if (tokens && tokens.access_token && tokens.refresh_token) {

      const otherUser: UserType | null = await getUserById(id as string, tokens);
      
      setPlayerTwo((previousValue: any) => {
        return {
          fullname: otherUser?.fullName,
        username: otherUser?.username,
        ranking: 20,
        matches: 85,
        level: otherUser?.levelGame,
        image: otherUser?.avatarUrl,
        };
      });
    }

  }

  useEffect(() => {
    setPlayerOne((previousValue: any) => {
      return {
        fullname: connectedUser?.fullName,
        username: connectedUser?.username,
        ranking: 20,
        matches: 85,
        level: connectedUser?.levelGame,
        image: connectedUser?.avatarUrl,
      };
    });

    if(id){
      gaurd();

      
      // setPlayerTwo((previousValue: any) => {
      //   return {
      //     fullname: "Samantha Williams",
      //     username: "Salliams",
      //     ranking: 10,
      //     matches: 120,
      //     level: 5,
      //     image: "public/avatars/member_2.png",
      //   };
      // });
    }

    // if(location.pathname === '/play/random'){
    //   setTimeout(() => {
    //     setPlayerTwo((previousValue:any) => {
    //       return {
    //         fullname: "Public Smith",
    //         username: "Pubsmith",
    //         ranking: 13,
    //         matches: 80,
    //         level: 10,
    //         image: "public/avatars/member_3.png",
    //       };
    //     });
    //   }, 4000);
    // }

    if(location.pathname === '/play/guest'){
      setPlayerTwo((previousValue:any) => {
        return {
          fullname: "Guest",
          username: "Guest",
          ranking: '▮',
          matches: '▮',
          level: '▮',
          image: "public/avatars/default.png",
        };
      });
    }

    Player.on("vsOne", (data: boolean) => {
      setDuo(data);
    })


  }, []);

  return (
    <>
      {!isDuo && <section className="section-players">
        <div className="container">
          <div className="section-players-content">
            {playerOne && <PlayerCard player={playerOne} playerType="player-1" />}
            {!playerOne && <PulsedCard pulsedType="pulsed-1" />}

            <div className="versus">
              <svg
                className="filled"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 256 256"
                enableBackground="new 0 0 256 256"
              >
                <g>
                  <g>
                    <path d="M10,57.5l37.8,141.3h52.2l36.8-141.5H85.6L73.4,102l-12-44.6H10L10,57.5z" />
                    <path d="M142.4,57.5l-25.4,98h50.5l-2.7,11.7h-51l-8.1,31.5h102.4l25.2-94.4h-51.3l3.6-14.7h51l9.2-32H142.4z" />
                  </g>
                </g>
              </svg>
            </div>

            {playerTwo && <PlayerCard player={playerTwo} playerType="player-2" />}
            {!playerTwo && <PulsedCard pulsedType="pulsed-2" />}
          </div>

          <div className="actions-buttons players-buttons">
            {(!playerOne || !playerTwo) && (<button className="action-button button-active">START RANDOM GAME</button>)}
            {(playerOne && playerTwo) && !isDuo && (<button onClick={onVs} className="action-button button-active">Start Game</button>)}
            {(playerOne && playerTwo) && !isDuo && (<Link to='/profile'  className="action-button button-inactive">Cancle</Link>)}
          </div>
        </div>
      </section>}
      {isDuo && <Duel />}
    </>
  );
};

export default Players;
