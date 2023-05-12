import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import { GlobalState } from "../../GlobalState";

function RequestTile({ request, sentByMe }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;
  const [friendUser, setFriendUser] = useState({});

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
        friendList: [...user.friendList, response.data.friendUser._id],
        requests: newRequestArray,
      });
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
        <div>
          <FaRegUserCircle></FaRegUserCircle>
          <h3>{friendUser.name}</h3>
          <button type="button" onClick={cancelRequest}>
            Cancel request
          </button>
        </div>
      ) : (
        <div>
          <FaRegUserCircle></FaRegUserCircle>
          <h3>{friendUser.name}</h3>
          <div>
            <button type="button" onClick={acceptRequest}>
              Accept request
            </button>
            <button type="button" onClick={declineRequest}>
              Decline request
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RequestTile;
