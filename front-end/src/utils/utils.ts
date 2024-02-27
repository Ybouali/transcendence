import axios from 'axios';
import { HistoryGameReturnedType, Tokens, UserType } from '../types';

function getCookie(name: string) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

export async function getTokensFromCookie(): Promise<Tokens | null> {
    let gat = getCookie('access_token');
    const grt = getCookie('refresh_token');

    let resData = null;

    if (!grt) return null;

    if (!gat) {
        // refresh the access token
        resData = await axios.get('http://localhost:3333/auth/refresh/', {
            headers: {
                refresh_token: grt,
            },
        });

        if (resData.data.message !== 'done') return null;
    }

    if (gat) {
        const tokensRet: Tokens = {
            access_token: gat,
            refresh_token: grt,
        };

        // need to make a request to make sure the tokens is valid before return them

        return tokensRet;
    }

    return null;
}

export async function getHisGamesByUserId(
    userId: string | null
): Promise<HistoryGameReturnedType[] | null> {
    const tokens: Tokens | null = await getTokensFromCookie();

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
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }
    const rHisgame: HistoryGameReturnedType[] = resData.data;

    return rHisgame;
}

export async function validateTowFactor(code: number): Promise<UserType | null> {

    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    const resData = await axios.get(`http://localhost:3333/tow-factor-auth/confirm/${code}`, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        }
    })
    .then((response) => response)
    .catch((err) => {});

    if (!resData || resData.data.message ) return null;

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    return userData;
}

export async function generateTowFactorQrCode(): Promise<UserType | null> {

    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    const resData = await axios.get('http://localhost:3333/tow-factor-auth/validated', {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        }
    })
    .then((response) => response)
    .catch((err) => {});

    if (!resData) return null;

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    return userData;
}

export async function updateUser(user: UserType): Promise<UserType | null> {
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    const resData = await axios
        .put('http://127.0.0.1:3333/users/update', user, {
            headers: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
        })
        .then((response) => response)
        .catch((err) => {});

    if (!resData) {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    // return the user data
    return userData;
}

export async function getUserInfo(): Promise<UserType | null> {
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    let resData = null;

    // send the request

    resData = await axios
        .get('http://127.0.0.1:3333/users/me', {
            headers: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
        })
        .then((response) => response)
        .catch((err) => {});

    if (!resData) {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    // return the user data
    return userData;
}

export async function getUserById(
    id: string,
    tokens: Tokens
): Promise<UserType | null> {
    // url
    const url: string = 'http://127.0.0.1:3333/users/' + id;

    let resData = null;

    // get data from the server
    resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        Status: resData.data.Status,
        avatarUrl: resData.data.avatarUrl,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    // return the user data
    return userData;
}

export async function getNumberOfWinnedGames(
    userId: string | undefined
): Promise<number | null> {
    if (userId === undefined) {
        return null;
    }

    // the url
    let url: string = 'http://localhost:3333/history-game/winnedgame/' + userId;

    const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens === null) {
        return null;
    }
    let resData = null;
    // make the req to the server
    resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }

    let win: number;

    if (resData.data.numberWinnedGame === undefined) {
        win = 0;
    } else {
        win = resData.data.numberWinnedGame;
    }

    return win;
}

export async function getNumberGamePlayedByUserId(
    userId: string | undefined
): Promise<number | null> {
    if (userId === undefined) {
        return 0;
    }

    // get the tokens from the local storage
    const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens === null) {
        return null;
    }

    // get the number of game winned by the player

    const win: number | null = await getNumberOfWinnedGames(userId);

    if (win === null) {
        return null;
    }

    // the url
    const url = 'http://localhost:3333/history-game/losedgame/' + userId;

    let resData = null;

    // make the req to the server
    resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }

    let lose: number = 0;

    if (resData.data.numberWinnedGame === undefined) {
        lose = 0;
    } else {
        lose = resData.data.numberWinnedGame;
    }

    return win + lose;
}
