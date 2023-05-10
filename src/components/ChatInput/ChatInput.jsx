import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { GlobalState } from "../../GlobalState";

import styles from "./ChatInput.module.css";

function ChatInput({ params, setter }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = setter;

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/message/send",
        {
          sender: user._id,
          senderName: user.name,
          message: message,
          groupId: params,
        },
        {
          headers: {
            Authorization: data.accessToken.current,
          },
        }
      );
      const newMessage = {
        sender: user._id,
        senderName: user.name,
        message: message,
        receiver: params,
        createdAt: new Date(Date.now()),
        _id: Date.now(),
      };

      data.socket.emit("sendMessage", newMessage);

      setMessage("");
      setMessages([...messages, newMessage]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form action="" className={styles.container} onSubmit={sendMessage}>
      <input
        type="text"
        name="sendMessage"
        id="sendMessage"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        autoComplete="off"
        placeholder="Send message"
      />
    </form>
  );
}

export default ChatInput;
