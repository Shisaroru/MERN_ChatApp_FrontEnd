import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { GlobalState } from "../../GlobalState";

import ChatInput from "../ChatInput/ChatInput";

import styles from "./ChatBox.module.css";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [group, setGroup] = useState({});
  const [groupName, setGroupName] = useState([]);
  const scrollChat = useRef(null);

  const params = useParams();

  const data = useContext(GlobalState);
  const [groups, setGroups] = data.groupsData;
  const [user, setUser] = data.user;

  useEffect(() => {
    async function getMessages() {
      try {
        if (!params.id) {
          return;
        }
        const response = await axios.post("/api/message", {
          groupId: params.id,
        });
        const found = groups.find((element) => {
          return element._id === params.id;
        });

        setGroupName(found.name.split(","));
        setGroup(found);
        setMessages(response.data.messagesList);
      } catch (error) {
        console.log(error);
      }
    }
    getMessages();
  }, [params.id]);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    scrollChat.current.scroll(0, scrollChat.current.scrollHeight);
  }, [messages]);

  return (
    <>
      {params.id ? (
        <div className={styles.container}>
          <p>{groupName[0] === user.name ? groupName[1] : groupName[0]}</p>
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
                      {date.getHours() + ":" + date.getMinutes()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <ChatInput
            params={params.id}
            setter={[messages, setMessages]}
          ></ChatInput>
        </div>
      ) : (
        <div id={styles.noGroup}>Add friend and chat now</div>
      )}
    </>
  );
}

export default ChatBox;
