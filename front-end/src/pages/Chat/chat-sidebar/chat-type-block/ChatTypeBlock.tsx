import React, { useContext, useEffect, useState } from "react";
import "./ChatTypeBlockStyle.css";
import ChatItem from "./chat-item/ChatItem";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getTokensFromCookie } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useConnectedUser } from '../../../../context/ConnectedContext';
import { SocketContext } from '../../../../context/SocketProvider';


interface CloseSelectedChat {
  id: string;
  payload?: {
    roomId: string;
  };
}

const ChatTypeBlock: React.FC<any> = ({ type, selectedChat, setSelectedChat, lastMessage,setLastMessage }) => {

  const [friendsMessages, setFriendsMessages] = useState([]);
  const [groupsMessages, setgroupsMessages] = useState([]);
  const [newFriend, setNewFriend] = useState(null);
  const [newGroup, setNewGroup] = useState(null);
  const socketData: any = useContext(SocketContext);
  const { connectedUser }: any = useConnectedUser()
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const tokens: any = await getTokensFromCookie();
      if (!tokens) {
        navigate("/notauth");
      }
      if (type == 'chat-friends') {
        const response = await fetch(`http://localhost:3333/messages/conversation/me`,{
          method: "GET",
          headers: {
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
          },
          });
          if (!response.ok){
            throw new Error('Try again, later!');
          }
        const data = await response.json();
        if (data?.statusCode !== undefined){
            throw new Error('Try again, Later!');
        }
        const transformedData = data.map((item: any) => ({
          id: item.user.id,
          status: (item.user.status).toLowerCase(),
          friend: {
            name: item.user.username,
            image: item.user.avatarUrl,
            message: item?.lastMessage?.message ? item?.lastMessage?.message : 'start conversation',
            notifications: item.unreadCount,
          },
          notifications: item.unreadCount
        }));
        
        setFriendsMessages(transformedData);
      }
      if (type == 'chat-groups') {
        const responseGroup = await fetch(`http://localhost:3333/room/all/conv`, {
          method: "GET",
          headers: {
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
          },
          });
        if (!responseGroup.ok){
          throw new Error('Try again, later!');
        }
        const dataGroup = await responseGroup.json();
        if (dataGroup?.statusCode !== undefined){
          throw new Error('Try again, Later!');
        }  
        const transformedDataGroup = dataGroup.map((item: any) => ({
          "id": item.id,
          "members": item.members,
          "group": {
            "name": item.roomName,
            "images": item.group.images,
            "message": item.group.lastMessage
          },
        }));
        setgroupsMessages(transformedDataGroup);
      }
    } catch (error) {
      toast.error('Try again, later!')
    }
  };

  useEffect(() => {
    console.log('connectedUser here:', connectedUser);
    fetchData();

    socketData.on("newFriend", (newFriendData: any) => {
      setNewFriend(newFriendData)
    });

    socketData.on("removeFriend", (removedFriendData: any) => {
      if (removedFriendData) {
        setFriendsMessages((prevValue: any) => prevValue.filter((item: any) => item.id !== removedFriendData?.id))
        setCloseSelectedChat(removedFriendData);
      };
    });

    socketData.on("leaveRoom", (removedRoomData: any) => {
        setgroupsMessages((prevValue: any) => prevValue.filter((item: any) => item.id !== removedRoomData?.payload?.roomId))
        setCloseSelectedChat(removedRoomData);
    });

    socketData.on("newRoom", (newRoomData: any) => {
      if (newRoomData) {
        setNewGroup(newRoomData)
      };
    });
  }, [connectedUser]);

  const [closeSelectedChat, setCloseSelectedChat] = useState<CloseSelectedChat | null>(null);
  
  useEffect(() => {
    if (closeSelectedChat && selectedChat) {
      if (selectedChat?.group_id === closeSelectedChat?.payload?.roomId) {
        setSelectedChat(null)
      } else if (selectedChat?.friend_id === closeSelectedChat?.payload?.roomId) {
        setSelectedChat(null)
      }
    }
  }, [closeSelectedChat]);

  useEffect(() => {
    console.log('neeeeeeeeeeeeeeeeew Frined');
    // fetchData();
    if (newFriend) setFriendsMessages((prevValue) => [...prevValue, newFriend]);
  }, [newFriend]);

  useEffect(() => {
    if (newGroup) setgroupsMessages((prevValue) => [...prevValue, newGroup]);
  }, [newGroup]);



  const [lastText, setLastText] = useState('');
  useEffect(()=> {
    if (lastMessage && lastMessage?.friendId) setLastText(lastMessage?.message)
    if (lastMessage && lastMessage?.groupId) setLastText(lastMessage?.message)
  
  }, [lastMessage, selectedChat]);



  if (type === "chat-friends") {
    return (
      <div className="chat-friends chat-sidebar-item">
        <div className="chat-sidebar-item-header">
          <div className="chat-title">Friends</div>
          <Link to='/friends'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path opacity="1" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg> See all
          </Link>
        </div>
        <ul className="chat-list scrollbar">
          {friendsMessages &&
            friendsMessages?.map((friendMessage: any, index) => {
              const key = `key-${index}`;
              return (
                <ChatItem
                  data={friendMessage}
                  type="friend"
                  key={key}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  lastText={friendMessage.id === lastMessage?.friendId ? lastText : 'start conversation'}
                />
              );
            })}
        </ul>
      </div>
    );
  }
  if (type === "chat-groups") {
    return (
      <div className="chat-groups chat-sidebar-item">
        <div className="chat-sidebar-item-header">
          <div className="chat-title">Groups</div>
          <Link to='/groups'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path opacity="1" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg> See all
          </Link>
        </div>
        <ul className="chat-list scrollbar">
          {groupsMessages &&
            groupsMessages?.map((groupMessage: any, index) => {
              const key = `key-${index}`;
              return (
                <ChatItem
                  data={groupMessage}
                  type="group"
                  key={key}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  lastText={groupMessage.id === lastMessage?.groupId ? lastText : ''}
                />
              );
            })}
        </ul>
      </div>
    );
  }
  return null;
};

export default ChatTypeBlock;
