import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import { GlobalState } from "../../GlobalState";

import styles from "../RequestTile/RequestTile.module.css";

function FriendTile({ id }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;
  const [friend, setFriend] = useState({});

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
      <h3>{friend.name}</h3>
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
