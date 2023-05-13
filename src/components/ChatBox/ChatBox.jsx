import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { GlobalState } from "../../GlobalState";

import ChatInput from "../ChatInput/ChatInput";

import styles from "./ChatBox.module.css";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState(null);
  const [groupName, setGroupName] = useState([]);
  const scrollChat = useRef(null);

  const params = useParams();

  const data = useContext(GlobalState);
  const [groups, setGroups] = data.groupsData;
  const [user, setUser] = data.user;
  const [isFriend, setIsFriend] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    if (!user || !group) {
      return;
    }
    if (group.members.length === 2) {
      let friend;
      if (group.members[0] === user._id) {
        friend = group.members[1];
      } else {
        friend = group.members[0];
      }
      if (!user.friendList.includes(friend)) {
        setIsFriend(false);
      }
    }
  }, [user, group]);

  useEffect(() => {
    async function getMessages() {
      try {
        if (!params.id) {
          return;
        }
        const response = await axios.post(
          "/api/message",
          {
            groupId: params.id,
          },
          {
            headers: {
              Authorization: data.accessToken.current,
            },
          }
        );
        const found = groups.find((element) => {
          return element._id === params.id;
        });

        let friendId;
        if (found.members[0] === user._id) {
          friendId = found.members[1];
        } else {
          friendId = found.members[0];
        }
        data.socket.on("offline", (id) => {
          if (found.members.includes(id)) {
            setOnlineStatus(false);
          }
        });
        data.socket.on("online", (id) => {
          if (found.members.includes(id)) {
            setOnlineStatus(true);
          }
        });

        data.socket.emit("checkOnline", friendId);

        setGroupName(found.name.split(","));
        setGroup(found);
        setMessages(response.data.messagesList);
      } catch (error) {
        console.log(error);
      }
    }
    getMessages();
    return () => {
      if (data.socket) {
        data.socket.removeAllListeners("online");
        data.socket.removeAllListeners("offline");
      }
    };
  }, [params.id]);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    function receivedMessage(arg) {
      if (params.id === arg.receiver) {
        setMessages([...messages, arg]);
      }
    }

    if (data.socket) {
      data.socket.on("newMessage", receivedMessage);
    }
    scrollChat.current.scroll(0, scrollChat.current.scrollHeight);

    return () => {
      if (data.socket) {
        data.socket.off("newMessage", receivedMessage);
      }
    };
  }, [messages, data.socket]);

  const formatTime = (time) => {
    if (parseInt(time) < 10) {
      return "0" + time;
    } else {
      return time;
    }
  };

  return (
    <>
      {params.id ? (
        <div className={styles.container}>
          <div>
            <p className={styles.groupName}>
              {groupName[0] === user.name ? groupName[1] : groupName[0]}
            </p>
            {onlineStatus ? (
              <p className={styles.online}>● online</p>
            ) : (
              <p className={styles.offline}>● offline</p>
            )}
          </div>
          <div id={styles.container} ref={scrollChat}>
            <div className={styles.chatContainer}>
              {messages.map((message) => {
                const date = new Date(message.createdAt);
                return (
                  <div
                    key={message._id}
                    className={
                      user._id === message.sender
                        ? styles.sendByMe
                        : styles.notByMe
                    }
                  >
                    {message.message}
                    <p className={styles.time}>
                      {formatTime(date.getHours()) +
                        ":" +
                        formatTime(date.getMinutes())}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          {isFriend ? (
            <ChatInput
              params={params.id}
              setter={[messages, setMessages]}
            ></ChatInput>
          ) : (
            <p>You are not their friend. Add them to start chatting</p>
          )}
        </div>
      ) : (
        <div id={styles.noGroup}>Add friend and chat now</div>
      )}
    </>
  );
}

export default ChatBox;
