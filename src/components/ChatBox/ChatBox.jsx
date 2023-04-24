import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { GlobalState } from "../../GlobalState";

import ChatInput from "../ChatInput/ChatInput";

import styles from "./ChatBox.module.css";

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [groupData, setGroupData] = useState(false);
  const params = useParams();
  const data = useContext(GlobalState);

  const [groupName, setGroupName] = useState(["1", "2"]);

  useEffect(() => {
    async function getMessages() {
      try {
        const response = await axios.post("/api/message", {
          groupId: params.id,
        });
        const group = await axios.post("/api/group", {
          id: params.id,
        });
        setMessages(response.data.messagesList);
        setGroupData(group.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    getMessages();
  }, [params.id]);

  useEffect(() => {
    if (groupData) {
      setGroupName(groupData.name.split(","));
    }
  }, [groupData]);

  return (
    <div className={styles.container}>
      <p>
        {groupName[0] === data.user.current.name ? groupName[1] : groupName[0]}
      </p>
      <div id={styles.container}>
        <div className={styles.chatContainer}>
          {messages.map((message) => {
            const date = new Date(message.createdAt);
            return (
              <div
                key={message._id}
                className={
                  data.user.current._id === message.sender
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
      <ChatInput params={params.id}></ChatInput>
    </div>
  );
}

export default ChatBox;
