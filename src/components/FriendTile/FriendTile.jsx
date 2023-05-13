import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import { GlobalState } from "../../GlobalState";

import styles from "../RequestTile/RequestTile.module.css";

function FriendTile({ id }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;
  const [friend, setFriend] = useState({});
  const [onlineStatus, setOnlineStatus] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.post(
          "/api/user/getOneUser",
          {
            id: id,
          },
          {
            headers: {
              Authorization: data.accessToken.current,
            },
          }
        );

        setFriend(response.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
    data.socket.on("offline", (receiveId) => {
      if (id === receiveId) {
        setOnlineStatus(false);
      }
    });
    data.socket.on("online", (receiveId) => {
      if (id === receiveId) {
        setOnlineStatus(true);
      }
    });
    data.socket.emit("checkOnline", id);
    return () => {
      if (data.socket) {
        data.socket.removeAllListeners("online");
        data.socket.removeAllListeners("offline");
      }
    };
  }, [id]);

  const unFriend = async () => {
    try {
      const result = await axios.patch(
        "/api/user/unfriend",
        {
          id: user._id,
          friendId: id,
        },
        {
          headers: {
            Authorization: data.accessToken.current,
          },
        }
      );

      setUser(result.data.newUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.containerContact}>
      <FaRegUserCircle className={styles.icon}></FaRegUserCircle>
      <h3>
        {friend.name}
        {onlineStatus ? (
          <span className={styles.online}>● online</span>
        ) : (
          <span className={styles.offline}>● offline</span>
        )}
      </h3>
      <button
        type="button"
        onClick={unFriend}
        className={
          styles.button + " " + styles.buttonRed + " " + styles.buttonGroup
        }
      >
        Unfriend
      </button>
    </div>
  );
}

export default FriendTile;
