import React, { useEffect, useRef, useState } from 'react'

import "./GamesHistoryStyle.css"
import { HistoryGameReturnedType } from '../../../types';
import GameHistoryItem from './GameHistoryItem/GameHistoryItem';
import { useParams } from 'react-router-dom';
import { getHisGamesByUserId } from '../../../utils/utils';

function GamesHistory( ) {

  const { userId } = useParams();

  const [dataHisGame, setDataHisGame] = useState<HistoryGameReturnedType [] | null>(null);

  useEffect(() => {
    
    if (userId) {
      getDatahistoryGames(userId)
    } else {
      getDatahistoryGames(null)
    }

  }, []);

  const getDatahistoryGames = async (userId: string | null) => {


    try {
      
      let data: HistoryGameReturnedType [] | null = null;

      if (userId) {
        data = await getHisGamesByUserId(userId);
      } else {
        
        data = await getHisGamesByUserId(null);
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

    // let data: HistoryGameReturnedType [] | null = null;

    // if (userId) {
    //   data = await getHisGamesByUserId(userId);
    // } else {
      
    //   data = await getHisGamesByUserId(null);
    // }

    // setDataHisGame(data);
  }
  
    return (
      <table>
        <thead>
            <tr>
                <th>Player 1</th>
                <th>Player 1 Score</th>
                <th>Player 2 Score</th>
                <th>Player 2</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
          { dataHisGame && dataHisGame.map((game: HistoryGameReturnedType, index) => (
              <GameHistoryItem key={index} player1={game.player1} player2={game.player2} timestamp={game.timestamp} />
            )) 
          }
        </tbody>
    </table>
    );
}

export default GamesHistory
