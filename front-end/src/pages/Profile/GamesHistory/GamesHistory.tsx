import React, { useEffect, useRef } from 'react'

import "./GamesHistoryStyle.css"
import { HistoryGameReturnedType } from '../../../types';
import GameHistoryItem from './GameHistoryItem/GameHistoryItem';

interface ChildProps {
  objects: HistoryGameReturnedType[]
}

function GamesHistory( props: ChildProps) {

  const dataHisGame: HistoryGameReturnedType [] = props.objects;

  useEffect(() => {
    
  }, []);
  
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
          { dataHisGame.map((game: HistoryGameReturnedType) => {
              return <GameHistoryItem player1={game.player1} player2={game.player2} timestamp={game.timestamp} />;
            }) 
          }
        </tbody>
    </table>
    );
}

export default GamesHistory
