import { HistoryGameReturnedType, Tokens, UserType } from "../types"

export async function getTokensFromSessionStorage(): Promise<Tokens | null> {

    let gat = sessionStorage.getItem('access_token');
    const grt = sessionStorage.getItem('refresh_token');

    let resData = null;

    if (!grt) return null;

    if (!gat) {

        resData = await fetch('http://localhost:3333/auth/refresh/', {
            method: 'GET',
            headers: {
                'refresh_token': grt,
            }
        })
        .then(response => {
            return response.json();
        })

        if (!resData) return null;

        gat = resData.access_token;

        sessionStorage.setItem('access_token', resData.access_token);
    }
    if (gat) {
        const userData: UserType | null = await getUserInfo({ access_token: gat, refresh_token: grt });

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

        const user: UserType | null = await getUserInfo(tokens);

        if (!user) {
            return null;
        }

        userId = user.id;
    }

    const resData = await fetch('http://localhost:3333/history-game/games/' + userId, {
        method: 'GET',
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
        }
    })
    .then(response => {
        return response.json();
    })

    if (!resData) {
        return null;
    }
    const rHisgame: HistoryGameReturnedType [] = resData;

    return rHisgame;

}

export async function getUserInfo(tokens: Tokens | null): Promise<UserType | null> {

    if (tokens === null) {
        return null;
    }

    let resData = null;

    // send the request
    resData = await fetch('http://localhost:3333/users/me', {
        method: 'GET',
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
        },
        })
            .then(response => {
            return response.json();
        })
        // .catch (err => {
        //     // console.error(err);
        //     return null;
        // })

    if (!resData) {
        return null;
    }

    const userData: UserType = {
        id: resData.id,
        username: resData.username,
        email: resData.email,
        avatarNameUrl: resData.avatarNameUrl,
        fullName: resData.fullName,
        isOnLine: resData.isOnLine,
        levelGame: resData.levelGame,
    }

    // return the user data
    return userData;
  }

  export async function getUserById(id: string, tokens: Tokens): Promise<UserType | null> {

    // url
    const url: string = "http://localhost:3333/users/" + id;

    let resData = null;

    // get data from the server
    resData = await fetch(url,
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
    // .catch(err => {
    //     // console.error(err);
    //     return null;
    // }) 

    if (!resData) {
        return null;
    }

    const userData: UserType = {
        id: resData.id,
        username: resData.username,
        email: resData.email,
        avatarNameUrl: resData.avatarNameUrl,
        fullName: resData.fullName,
        isOnLine: resData.isOnLine,
        levelGame: resData.levelGame,
    }

    // return the user data
    return userData;

  }

  export async function getNumberOfWinnedGames(userId: string | undefined): Promise<number | null> {

    // the url 
    let url: string = "http://localhost:3333/history-game/winnedgame/" + userId;

    const tokens: Tokens | null = await getTokensFromSessionStorage();

    if (tokens === null) {
        return null;
    }
    let resData = null;
    // make the req to the server
    resData = await fetch(url,
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
    // .catch(err => {
    //     // console.error(err);
    //     return null;
    // })

    if (!resData) {
        return null;
    }

    let win: number;


    if (resData.numberWinnedGame === undefined) {
        win = 0;
    }
    else {
        win = resData.numberWinnedGame;
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
    resData = await fetch(url,
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
    // .catch(err => {
    //     // console.error(err);
    //     return null;
    // })

    if (!resData) {
        return null;
    }

    let lose: number = 0;

    if (resData.numberWinnedGame === undefined) {
        lose = 0;
    }
    else {
        lose = resData.numberWinnedGame;
    }

    return win + lose;
  }