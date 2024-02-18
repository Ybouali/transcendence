import { useEffect, useState } from "react";
import { UserType } from "../types";
import { getUserInfo } from "../utils/utils";
import UserContext from "./UserContext";

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ( { children } ) => {

    const [user, setUser] = useState< UserType | null >(null);

    useEffect( () => { initDataUser()  })


    const initDataUser = async () => {
        const userData: UserType | null = await getUserInfo();
        
        if (userData) { 
            setUser(userData);
        }
    }



    return <UserContext.Provider value={user} > 
        { children }
    </UserContext.Provider>
}