import { useDeferredValue, useEffect, useRef, useState, useContext } from "react";
import "./HeaderStyle.css";
import { useNavigate } from "react-router-dom";
import { useConnectedUser } from "../../context/ConnectedContext";
import useClickOutside from "../../utils/hooks/useClickOutside";
import useFetch from "../../utils/hooks/useFetch";
import { LoginType, Tokens } from "../../types";
import StaticHeaderHome from "./StaticHeader/StaticHeader";
import DynamicHeader from "./DynamicHeader/DynamicHeader";
import { getCookie, getTokensFromCookie } from "../../utils/utils";


const Header = (props: LoginType) => {

    const navigate = useNavigate();

    const { connectedUser } = useConnectedUser();

    const [justOpened, setJustOpened] = useState(false);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    
    const dropDownMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      
      getAuth();

    }, [setIsConnected])

    const setConnectedUser = () => {

      setIsConnected(!isConnected);

    }

    const getAuth = async () => {

      const gat = getCookie('access_token');
      const grt = getCookie('refresh_token');

      if (gat && grt) {
        
        console.log("hello world !");

        const token: Tokens | null = await getTokensFromCookie();
  
        if (token) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }

      }


    }

    useClickOutside(dropDownMenuRef, () => {
        // CHECK IF THE MODAL JUST OPENED
        if (justOpened) {
        setJustOpened(false);
        return;
        }
    });

    

  return (
    <>
      {!isConnected && <StaticHeaderHome logInFunc={props.logInFunc} />  }

      {isConnected && <DynamicHeader setIsConnected={setConnectedUser} />}
    </>
  );
};

export default Header;
