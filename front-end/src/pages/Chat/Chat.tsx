import React, { useEffect, useState, useContext } from "react";
import ChatConversation from "./chat-conversation/ChatConversation";
import ChatSidebar from "./chat-sidebar/ChatSidebar";
import ChatContext from "./ChatContext";
import { useConnectedUser } from '../../context/ConnectedContext';
import { useParams } from "react-router-dom";
import "./ChatStyle.css";
import { getTokensFromCookie } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header/Header";

interface SelectedChat {
  user_id: string | undefined;
  friend_id?: string;
  group_id?: string;
  type: 'users' | 'groups';
}

interface ChatData {
  chatMessages: any[];
  conversationInfos: any;
  isBanned: boolean;
  isMuted: boolean;
}

const Chat = () => {

  const { connectedUser } = useConnectedUser()
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [url, setUrl] = useState<string | null>(null);
  const [value, setValue] = useState<any>(null);
  const navigate = useNavigate();

  const {id} = useParams();
  useEffect(() => {
    if (id) {
      const friend_id = id;
      setSelectedChat((prevValue: any) => {return {user_id: connectedUser?.id, friend_id, type: 'users'}})
    }
  }, [id]);

  useEffect(() => {
    if (selectedChat !== null) {
      if (selectedChat?.type === "users") {
        setUrl(`http://localhost:3333/messages/conversation/${selectedChat?.friend_id}`
        );
      }
      if (selectedChat?.type === "groups") {
        setUrl(`http://localhost:3333/room/messages/${selectedChat?.group_id}`);
      }
    }
  }, [selectedChat]);


  const fetchData = async (url: any) => {
        const tokens: any = await getTokensFromCookie();

        if (!tokens) {
            navigate("/notauth");
        }
    
        try {
            const response = await fetch(url, {
            method: "GET",
            headers: {
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
            },
            });
            const res = await response.json();
            if (res?.statusCode !== undefined){
                throw new Error('Try again, Later!');
            }
            setValue(res);
        } catch (error) {
            toast.error('Try again, Later!')
        } 
}

  useEffect(() => {
    if (url) {
      fetchData(url);
    }
  }, [url])

  useEffect(() => {

    if (value) {
      setChatData(value)
    }
  }, [url, value])

  return (
    <>
      {/* <Header isConnected={true}  /> */}
      <section className="chat">
        <div className="container">
          <div className="chat-content">
            <ChatContext.Provider value={{ selectedChat, setSelectedChat, lastMessage, setLastMessage }}>
              <ChatSidebar />
                <ChatConversation
                  chatMessages={chatData?.chatMessages}
                  conversationInfos={chatData?.conversationInfos}
                  isBanned={chatData?.isBanned}
                  isMuted={chatData?.isMuted}
                  setChatData={setChatData}
                />
            </ChatContext.Provider>
          </div>
        </div>
      </section>
    </>
  );
};

export default Chat;
