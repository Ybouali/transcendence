import React from 'react'
import "./GameHistoryItemStyle.css"

function GameHistoryItem({ gameLog }) {
    const { player1, player2, timestamp } = gameLog;
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed, so we add 1
    const day = date.getDate();
  
    return (
      <tr>
        <td className={`${player1.score >= player2.score ? "winner" : ""}`}>
          <a href="#">{player1.username}</a>
        </td>
        <td>{player1.score}</td>
        <td>{player2.score}</td>
        <td className={`${player2.score >= player1.score ? "winner" : ""}`}>
          <a href="http://example.com/58">{player2.username}</a>
        </td>
        <td>{`${year}-${month}-${day}`}</td>
      </tr>
    );
}

export default GameHistoryItem
