export interface LoginType {
    isConnected: boolean;
    logInFunc?: () => void;
    refresh_token?: string;
    access_token?: string;
}
