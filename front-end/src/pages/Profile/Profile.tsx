import React from 'react'
import Header from '../../components/Header/Header'
import "./ProfileStyle.css"
import ProfileUserInfos from './ProfileUserInfos/ProfileUserInfos'
import ProfileButtonActions from './ProfileButtonActions/ProfileButtonActions'
import ProfileAchievements from './ProfileAchievements/ProfileAchievements'
// import GamesHistory from './GamesHistory/GamesHistory'
import { HistoryGameReturnedType } from '../../types'

function Profile() {

  const gamesLog: HistoryGameReturnedType [] = [
    {
      player1: {
        id: "546",
        username: "john doe",
        score: 40,
      },
      player2: {
        id: "6",
        username: "samantha williams",
        score: 40,
      },
      timestamp: "2022-03-15T12:34:56.789Z",
    },
    {
      player1: {
        id: "123",
        username: "jane smith",
        score: 20,
      },
      player2: {
        id: "789",
        username: "michael jones",
        score: 30,
      },
      timestamp: "2022-03-16T09:12:34.567Z",
    },
    {
      player1: {
        id: "456",
        username: "bob brown",
        score: 50,
      },
      player2: {
        id: "321",
        username: "alice green",
        score: 5,
      },
      timestamp: "2022-03-17T15:45:23.456Z",
    },
    {
      player1: {
        id: "987",
        username: "david lee",
        score: 15,
      },
      player2: {
        id: "234",
        username: "emily wang",
        score: 25,
      },
      timestamp: "2022-03-18T21:43:12.345Z",
    },
    {
      player1: {
        id: "567",
        username: "jimmy chen",
        score: 35,
      },
      player2: {
        id: "890",
        username: "sophia kim",
        score: 45,
      },
      timestamp: "2022-03-19T11:23:45.678Z",
    },
    {
      player1: {
        id: "432",
        username: "lisa zhang",
        score: 60,
      },
      player2: {
        id: "876",
        username: "kevin li",
        score: 10,
      },
      timestamp: "2022-03-20T17:34:56.789Z",
    },
    {
      player1: {
        id: "654",
        username: "tommy nguyen",
        score: 25,
      },
      player2: {
        id: "321",
        username: "jessica wu",
        score: 30,
      },
      timestamp: "2022-03-21T08:45:23.456Z",
    },
    {
      player1: {
        id: "789",
        username: "ryan park",
        score: 40,
      },
      player2: {
        id: "234",
        username: "grace lee",
        score: 20,
      },
      timestamp: "2022-03-22T14:43:12.345Z",
    },
    {
      player1: {
        id: "345",
        username: "jason chung",
        score: 15,
      },
      player2: {
        id: "678",
        username: "olivia kim",
        score: 25,
      },
      timestamp: "2022-03-23T20:23:45.678Z",
    },
    {
      player1: {
        id: "901",
        username: "jenny huang",
        score: 50,
      },
      player2: {
        id: "432",
        username: "peter wang",
        score: 5,
      },
      timestamp: "2022-03-24T10:34:56.789Z",
    },
    {
      player1: {
        id: "567",
        username: "jimmy chen",
        score: 35,
      },
      player2: {
        id: "890",
        username: "sophia kim",
        score: 45,
      },
      timestamp: "2022-03-25T07:45:23.456Z",
    },
    {
      player1: {
        id: "123",
        username: "jane smith",
        score: 20,
      },
      player2: {
        id: "789",
        username: "michael jones",
        score: 30,
      },
      timestamp: "2022-03-26T13:43:12.345Z",
    },
    {
      player1: {
        id: "654",
        username: "tommy nguyen",
        score: 25,
      },
      player2: {
        id: "321",
        username: "jessica wu",
        score: 30,
      },
      timestamp: "2022-03-27T19:23:45.678Z",
    },
    {
      player1: {
        id: "901",
        username: "jenny huang",
        score: 50,
      },
      player2: {
        id: "432",
        username: "peter wang",
        score: 5,
      },
      timestamp: "2022-03-28T09:34:56.789Z",
    },
    {
      player1: {
        id: "987",
        username: "david lee",
        score: 15,
      },
      player2: {
        id: "234",
        username: "emily wang",
        score: 25,
      },
      timestamp: "2022-03-29T16:45:23.456Z",
    },
    {
      player1: {
        id: "456",
        username: "bob brown",
        score: 50,
      },
      player2: {
        id: "321",
        username: "alice green",
        score: 5,
      },
      timestamp: "2022-03-30T12:43:12.345Z",
    },
    {
      player1: {
        id: "345",
        username: "jason chung",
        score: 15,
      },
      player2: {
        id: "678",
        username: "olivia kim",
        score: 25,
      },
      timestamp: "2022-03-31T18:23:45.678Z",
    },
    {
      player1: {
        id: "789",
        username: "ryan park",
        score: 40,
      },
      player2: {
        id: "234",
        username: "grace lee",
        score: 20,
      },
      timestamp: "2022-04-01T08:34:56.789Z",
    },
    {
      player1: {
        id: "432",
        username: "lisa zhang",
        score: 60,
      },
      player2: {
        id: "876",
        username: "kevin li",
        score: 10,
      },
      timestamp: "2022-04-01T08:34:56.789Z",
    },
  ];


  return (
    <>
      <Header isConnected={true}  />
      <section className="profile">
        <div className="container">
          <div className="profile-content" data-status="online">
            <ProfileUserInfos />
            <ProfileButtonActions />
            <ProfileAchievements />
            {/* <GamesHistory objects={gamesLog} /> */}
          </div>
        </div>
      </section>
    </>
  )
}

export default Profile
