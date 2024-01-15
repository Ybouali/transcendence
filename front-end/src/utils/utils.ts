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

    const url: string = "http://localhost:3333/users/" + id;

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