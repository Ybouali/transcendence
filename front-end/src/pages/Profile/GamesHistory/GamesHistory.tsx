import React, { useEffect, useRef, useState } from 'react'

import "./GamesHistoryStyle.css"
import { HistoryGameReturnedType, Tokens, UserType } from '../../../types';
import GameHistoryItem from './GameHistoryItem/GameHistoryItem';
import { useParams } from 'react-router-dom';
import { getHisGamesByUserId, getTokensFromCookie } from '../../../utils/utils';
import DataTable from "datatables.net-dt";
import "datatables.net-buttons"
import "datatables.net-responsive"
import "datatables.net-dt/css/dataTables.dataTables.css";
import $ from 'jquery';
import { useConnectedUser } from '../../../context/ConnectedContext';

function GamesHistory( ) {

  const [tableInitialized, setTableInitialized] = useState<boolean>(false);

  const { connectedUser, setConnectedUser } = useConnectedUser();

  const { userId } = useParams();

  const [dataHisGame, setDataHisGame] = useState<HistoryGameReturnedType [] | null>(null);

  useEffect(() => {
    initData();
  }, [setDataHisGame]);

  const initData = async () => {

    const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens && tokens.access_token && tokens.refresh_token)  {

      if (userId) {
      
        await getDatahistoryGames(userId)
      
      } else {
        
        if (connectedUser?.id) {
          await getDatahistoryGames(connectedUser.id)
        }

      }  

    }

  }

  const getDatahistoryGames = async (userId: string | null) => {

    let data: HistoryGameReturnedType [] | null = null;

    try {

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
  }

  const tableRef = useRef<any>();

  useEffect(() => {


    if (!tableInitialized) {
      
      // Then you can reinitialize your DataTable
      $('#example').DataTable();

      setTableInitialized(true);
    }

    const table: any = new DataTable(tableRef.current, {
      dom: "Bfrtip",
      buttons: ["copy", "csv", "excel", "pdf", "print"],
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"],
      ],
      pageLength: 5,
      order: [],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/English.json",
      },
      columnDefs: [{ target: 0, orderable: true }], // TODO: target 0 makansh
      rowCallback: function (row: any, data, index) {
        // Apply the dark theme to the row
        var cells = row.getElementsByTagName("td");
        for (var i = 0; i < cells.length; i++) {
          cells[i].style.backgroundColor = "black";
          cells[i].style.borderColor = "gray";
        }
      },
      responsive: true,
    });

    return () => {
      // Destroy the DataTable instance when the component unmounts
      table.destroy();
    };
  }, []); // Empty dependency array ensures that the effect runs only once on mount

    return (
      <table
        ref={tableRef}
        id="example"
        className="display"
        style={{ width: "100%" }}
      >
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
          {dataHisGame?.length !== 0 &&
            dataHisGame?.map((gameLog: HistoryGameReturnedType, index: number) => {
              const key = `game-${index}`;
              return <GameHistoryItem key={index} player1={gameLog.player1} player2={gameLog.player2} timestamp={gameLog.timestamp} />;
            })}
        </tbody>
      </table>
    );
}

export default GamesHistory
