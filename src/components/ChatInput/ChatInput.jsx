import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { GlobalState } from "../../GlobalState";

import styles from "./ChatInput.module.css";

function ChatInput({ params, setter }) {
  const data = useContext(GlobalState);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = setter;

  useEffect(() => {
    function receivedMessage(arg) {
      setMessages([...messages, arg]);
    }

    if (data.socket) {
      data.socket.on("newMessage", receivedMessage);
    }

    return () => {
      if (data.socket) {
        data.socket.off("newMessage", receivedMessage);
      }
    };
  }, [messages, data.socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/message/send", {
        sender: data.user.current._id,
        senderName: data.user.current.name,
        message: message,
        groupId: params,
      });
      const newMessage = {
        sender: data.user.current._id,
        senderName: data.user.current.name,
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
