import { Tokens } from "../types"

export async function getTokensFromLocalStorge (): Promise<Tokens> {


    // get tokens from local storge
    const [ at, rt ] = await Promise.all([
        localStorage.getItem('access_token'),
        localStorage.getItem('refresh_token')
    ])


    // if tokens not exist return empty object
    if (!at || !rt) {
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