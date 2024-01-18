import { Tokens, UserType } from "../types"

export async function getTokensFromLocalStorge (): Promise<Tokens | null> {

    setTimeout( async () => {
        // get tokens from local storge

        let at: string | null = localStorage.getItem('access_token');
        let rt: string | null = localStorage.getItem('refresh_token');

        let resData = null;

        // if tokens not exist return empty object
        if (rt === null) {
            return null;
        }

        if (!at) {

            // need to get new access token from the server and store it in local storge

            resData = await fetch('http://localhost:3333/auth/refresh/', {
                method: 'GET',
                headers: {
                    'refresh_token': rt
                }
            })
            .then(response => {
                return response.json();
            })
            // .catch(err => {
            //     return null;
            // })

            if (!resData) {
                return null;
            }

            at = resData.access_token;

            // need to set the new access token ??
            localStorage.setItem('access_token', resData.access_token);
        }

        // now need to check if the the tokens is valid on the server 
        const userData: UserType | null = await getUserInfo({ access_token: resData.access_token, refresh_token: rt });

        if (!userData) {
            return null;
        }

        const tokensRet: Tokens = {
            access_token: resData.access_token,
            refresh_token: rt
        }

        // return tokens 
        return tokensRet;
    }, 1000)

    return null;
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

    const tokens: Tokens | null = await getTokensFromLocalStorge();

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
    const tokens: Tokens | null = await getTokensFromLocalStorge();

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