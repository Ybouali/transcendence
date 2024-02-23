import { createContext, useEffect, useState } from "react";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import { ConnectedContext } from "./ConnectedContext";
import { UserType } from "../types";
import { getUserInfo } from "../utils/utils";

interface UserProviderProps {
  children: React.ReactNode;
}


export const ConnectedProvider: React.FC<UserProviderProps> = ({ children }) => {

  const [ connectedUser, setConnectedUser] = useLocalStorage("connected-user", {});

  
  // IF THE JWT CONTAINS JUST THE ID, NOT ALL THE USER DATA
  useEffect(() => {
    initData();
  }, [setConnectedUser])

  const initData = async () => {

    const userData: UserType | null = await getUserInfo();

    if (userData) {
      setConnectedUser(userData)
    }

  }

  return (
    <ConnectedContext.Provider value={{ connectedUser, setConnectedUser }}>
      {children}
    </ConnectedContext.Provider>
  );
}

export default ConnectedProvider;
