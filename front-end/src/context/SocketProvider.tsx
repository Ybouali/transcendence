// import io from "socket.io-client";
// import React, { useEffect, useState } from "react";
// // import { getTokensFromCookie } from '../utils/utils';
// import { useUser } from "./UserContext";
// const SocketContext = React.createContext(null);

// export { SocketContext };

// export default function SocketProvider({ children }: any) {
//     const [socket, setSocket] = useState<any>(null);
//     const { user } = useUser();

//     useEffect(() => {
//         console.log('For now there is no user');
//         if (user) {
//             console.log('user is here:', user);
//             const newSocket = io("http://localhost:3333/chat", {
//                 query: { userId: user.id },
//         });
//         setSocket(newSocket);

//         // return () => newSocket.close();
//         return () => {
//             newSocket.close();
//         };
//         }
//     }, [user]);

//     return (
//         <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//     );
// }





import io from "socket.io-client";
import React, { useEffect, useState } from "react";
import { getCookie, getTokensFromCookie } from '../utils/utils';

const SocketContext = React.createContext(null);

const SocketProvider: React.FC<any> = ({ children }) => {
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {

        const gat = getCookie('access_token');
        const grt = getCookie('refresh_token');

      if (gat && grt) {

        const establishSocketConnection = async () => {
        const tokens = await getTokensFromCookie();

        if (!tokens) {
            console.log('There is not token here!');
            return;
        }

        const newSocket = io("http://localhost:3333/chat", {
            query: {
                access_token: tokens.access_token,
            },
        });

        newSocket.on('error', (error :any) => {
            console.error('Socket connection error:', error);
        });

        console.log('socket here: ', tokens.access_token,)

        setSocket(newSocket);
        };

        establishSocketConnection();
      }

        
    }, []);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };