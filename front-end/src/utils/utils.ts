import axios from "axios";
import { HistoryGameReturnedType, Tokens, UserType } from "../types"

export async function getTokensFromSessionStorage(): Promise<Tokens | null> {

    const coo = document.cookie;

    const ccArr = coo.split(';');

    console.log(ccArr)

    let gat = sessionStorage.getItem('access_token');
    const grt = sessionStorage.getItem('refresh_token');

    let resData = null;

    if (!grt) return null;

    if (!gat) {

        resData = await axios.get('http://localhost:3333/auth/refresh/', {
            headers: {
                'refresh_token': grt,
            }
        })

        if (!resData.data) return null;

        gat = resData.data.access_token;

        sessionStorage.setItem('access_token', resData.data.access_token);
    }
    if (gat) {
        const userData: UserType | null = await getUserInfo();

        if (!userData) {
            return null;
        }

        const tokensRet: Tokens = {
            access_token: gat,
            refresh_token: grt
        }

        return tokensRet;
    }
    
    return null;
}

export async function getHisGamesByUserId(userId: string | null): Promise<HistoryGameReturnedType [] | null> {

    const tokens: Tokens | null = await getTokensFromSessionStorage();

    if (!tokens) {
        return null;
    }

    if (!userId) {

        const user: UserType | null = await getUserInfo();

        if (!user) {
            return null;
        }

        userId = user.id;
    }

    const url = 'http://localhost:3333/history-game/games/' + userId;

    const resData = await axios.get(url, {
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
        }    
    })

    if (!resData.data) {
        return null;
    }
    const rHisgame: HistoryGameReturnedType [] = resData.data;

    return rHisgame;

}

export async function getUserInfo(): Promise<UserType | null> {

    // if (tokens === null) {
    //     return null;
    // }

    let resData = null;

    // send the request

    resData = await axios.get('http://localhost:3333/users/me')

    if (!resData.data) {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarNameUrl: resData.data.avatarNameUrl,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
    }

    // return the user data
    return userData;
  }

  export async function getUserById(id: string, tokens: Tokens): Promise<UserType | null> {

    // url
    const url: string = "http://localhost:3333/users/" + id;

    let resData = null;

    // get data from the server
    resData = await axios.get(url, {
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
        },
    });

    if (!resData.data) {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarNameUrl: resData.data.avatarNameUrl,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
    }

    // return the user data
    return userData;

  }

  export async function getNumberOfWinnedGames(userId: string | undefined): Promise<number | null> {

    if (userId === undefined) {
        return null;
    }

    // the url 
    let url: string = "http://localhost:3333/history-game/winnedgame/" + userId;

    const tokens: Tokens | null = await getTokensFromSessionStorage();

    if (tokens === null) {
        return null;
    }
    let resData = null;
    // make the req to the server
    resData = await axios.get(url, {
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
        },
    })

    if (!resData.data) {
        return null;
    }

    let win: number;


    if (resData.data.numberWinnedGame === undefined) {
        win = 0;
    }
    else {
        win = resData.data.numberWinnedGame;
    }

    return win;

  }

  export async function getNumberGamePlayedByUserId(userId: string | undefined): Promise<number | null> {

    if (userId === undefined) {
        return 0;
    }

    // get the tokens from the local storage
    const tokens: Tokens | null = await getTokensFromSessionStorage();

    if (tokens === null) {
        return null;
    }
    
    // get the number of game winned by the player
    
    const win: number | null = await getNumberOfWinnedGames(userId);

    if (win === null) {
        return null;
    }

    // the url 
    const url = "http://localhost:3333/history-game/losedgame/" + userId;

    let resData = null;

    // make the req to the server
    resData = await axios.get(url, {
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token        
        }
    });

    if (!resData.data) {
        return null;
    }

    let lose: number = 0;

    if (resData.data.numberWinnedGame === undefined) {
        lose = 0;
    }
    else {
        lose = resData.data.numberWinnedGame;
    }

    return win + lose;
  }