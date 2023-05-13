import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import { GlobalState } from "../../GlobalState";

import styles from "./RequestTile.module.css";

function RequestTile({ request, sentByMe }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;
  const [friendUser, setFriendUser] = useState({});
  const [requestData, setRequestData] = useState({});

  const cancelRequest = async () => {
    try {
      const response = await axios.delete("/api/request/cancel/", {
        data: {
          id: request,
        },
        headers: {
          Authorization: data.accessToken.current,
        },
      });
      const newSentRequestArray = user.sentRequests.filter(
        (value) => value !== request
      );
      setUser({ ...user, sentRequests: newSentRequestArray });
      data.socket.emit("cancel_request", request, requestData.targetUser);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async () => {
    try {
      const response = await axios.post(
        "/api/request/reply",
        {
          id: request,
        },
        {
          headers: {
            Authorization: data.accessToken.current,
          },
        }
      );

      const newRequestArray = user.requests.filter(
        (value) => value !== request
      );

      setUser({
        ...user,
        groupList: [...user.groupList, response.data.createdGroup._id],
        friendList: [...user.friendList, response.data.user._id],
        requests: newRequestArray,
      });
      data.socket.emit("joined_group", [response.data.createdGroup._id]);
      data.socket.emit(
        "joined_user",
        response.data.user._id,
        response.data.createdGroup._id
      );
    } catch (error) {
      console.log(error);
    }
  };

  const declineRequest = async () => {
    try {
      const response = await axios.delete("/api/request/cancel", {
        data: {
          id: request,
        },
        headers: {
          Authorization: data.accessToken.current,
        },
      });
      const newRequestArray = user.requests.filter(
        (value) => value !== request
      );
      data.socket.emit("decline_request", request, requestData.requestee);
      setUser({ ...user, requests: newRequestArray });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const responseRequest = await axios.post(
          "/api/request/getOneRequest",
          {
            id: request,
          },
          {
            headers: {
              Authorization: data.accessToken.current,
            },
          }
        );

        const targetId = sentByMe
          ? responseRequest.data.result.targetUser
          : responseRequest.data.result.requestee;

        const responseUser = await axios.post(
          "/api/user/getOneUser",
          {
            id: targetId,
          },
          {
            headers: {
              Authorization: data.accessToken.current,
            },
          }
        );

        setRequestData(responseRequest.data.result);
        setFriendUser(responseUser.data.result);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [request]);
  return (
    <>
      {sentByMe ? (
        <div className={styles.container}>
          <FaRegUserCircle className={styles.icon}></FaRegUserCircle>
          <h3>{friendUser.name}</h3>
          <button
            type="button"
            onClick={cancelRequest}
            className={
              styles.button + " " + styles.buttonRed + " " + styles.buttonGroup
            }
          >
            Cancel request
          </button>
          <div className={styles.message}>{requestData.message}</div>
        </div>
      ) : (
        <div className={styles.container}>
          <FaRegUserCircle className={styles.icon}></FaRegUserCircle>
          <h3>{friendUser.name}</h3>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={acceptRequest}
              className={styles.button + " " + styles.buttonGreen}
            >
              Accept request
            </button>
            <button
              type="button"
              onClick={declineRequest}
              className={styles.button + " " + styles.buttonRed}
            >
              Decline request
            </button>
          </div>
          <div className={styles.message}>{requestData.message}</div>
        </div>
      )}
    </>
  );
}

export default RequestTile;
