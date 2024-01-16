import { Tokens, UserType } from "../types"

export async function getTokensFromLocalStorge (): Promise<Tokens> {


    // get tokens from local storge
    const [ at, rt ] = await Promise.all([
        localStorage.getItem('access_token'),
        localStorage.getItem('refresh_token')
    ])


    // if tokens not exist return empty object
    if (at === null || rt === null) {
        return {
            access_token: '',
            refresh_token: ''
        };
    }

    // return tokens 
    return {
        access_token: at,
        refresh_token: rt
    }
}

export async function getUserInfo(tokens: Tokens): Promise<UserType | undefined> {

    if (tokens.refresh_token === null || tokens.access_token === null) {
        return undefined;
    }

    // send the request
    const resData = await fetch('http://localhost:3333/users/me', {
        method: 'GET',
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
        },
        })
            .then(response => {
            return response.json();
        })
        .catch (err => {
            console.error(err);
            return undefined;
        })

    const userData: UserType = {
        id: resData.id,
        username: resData.username,
        email: resData.email,
        avatarName: resData.avatarName,
        fullName: resData.fullName,
        isOnLine: resData.isOnLine,
        levelGame: resData.levelGame,
    }

    // return the user data
    return userData;
  }

  export async function getUserById(id: string, tokens: Tokens): Promise<UserType | undefined> {

    // url
    const url: string = "http://localhost:3333/users/" + id;

    // get data from the server
    const resData = await fetch(url,
        {
            method: "GET",
            headers: {
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
            }
        }
    )
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.error(err);
        return undefined;
    }) 

    if (resData.id === undefined) {
        return undefined;
    }

    const userData: UserType = {
        id: resData.id,
        username: resData.username,
        email: resData.email,
        avatarName: resData.avatarName,
        fullName: resData.fullName,
        isOnLine: resData.isOnLine,
        levelGame: resData.levelGame,
    }

    // return the user data
    return userData;

  }

  export async function getNumberOfWinnedGames(userId: string | undefined): Promise<number> {

    // the url 
    let url: string = "http://localhost:3333/history-game/winnedgame/" + userId;

    const tokens: Tokens = await getTokensFromLocalStorge();

    // make the req to the server
    let resData = await fetch(url,
        {
            method: "GET",
            headers: {
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
            }
        }
    )
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.error(err);
        return undefined;
    })

    let win: number;


    if (resData.numberWinnedGame === undefined) {
        win = 0;
    }
    else {
        win = resData.numberWinnedGame;
    }

    return win;

  }

  export async function getNumberGamePlayedByUserId(userId: string | undefined): Promise<number> {

    if (userId === undefined) {
        return 0;
    }

    // get the tokens from the local storage
    const tokens: Tokens = await getTokensFromLocalStorge();
    
    // get the number of game winned by the player
    
    const win: number = await getNumberOfWinnedGames(userId);

    // the url 
    const url = "http://localhost:3333/history-game/losedgame/" + userId;

    // make the req to the server
    const resData = await fetch(url,
        {
            method: "GET",
            headers: {
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
            }
        }
    )
    .then(response => {
        return response.json()
    })
    .catch(err => {
        console.error(err);
        return 0;
    })

    let lose: number ;

    if (resData.numberWinnedGame === undefined) {
        lose = 0;
    }
    else {
        lose = resData.numberWinnedGame;
    }

    return win + lose;
  }