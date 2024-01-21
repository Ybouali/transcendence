import React from 'react'
import "./GameHistoryItemStyle.css"
import { HistoryGameReturnedType } from '../../../../types';

function GameHistoryItem(props: HistoryGameReturnedType) {
    const { player1, player2, timestamp } = props;
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    return (
      <tr>
        <td data-label="Player 1">{player1.username}</td>
        <td data-label="Player 1 Score">{player1.score}</td>
        <td data-label="Player 2 Score">{player2.score}</td>
        <td data-label="Player 2">{player2.username}</td>
        <td data-label="Date"> {day-month-year} </td>
      </tr>
    );
}

export default GameHistoryItem
