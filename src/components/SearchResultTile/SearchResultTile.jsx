import { useContext, useState } from "react";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import { GlobalState } from "../../GlobalState";

import styles from "./SearchResultTile.module.css";

function SearchResultTile({ resultUser }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;

  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");

  const [intersectRequests, setIntersectRequests] = useState(
    user.requests.filter((value) => resultUser.sentRequests.includes(value))
  );
  const [intersectSentRequests, setIntersectSentRequests] = useState(
    user.sentRequests.filter((value) => resultUser.requests.includes(value))
  );
  const [alreadyFriend, setAlreadyFriend] = useState(
    user.friendList.includes(resultUser._id)
  );

  const sendRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/request/create",
        {
          requestee: user._id,
          targetUser: resultUser._id,
          message: message,
        },
        {
          headers: {
            Authorization: data.accessToken.current,
          },
        }
      );

      setUser({
        ...user,
        sentRequests: [...user.sentRequests, response.data.result._id],
      });
      setMessage("");
      setModal(false);
      setIntersectSentRequests([response.data.result._id]);
      alert("Request sent");
    } catch (error) {
      console.log(error);
    }
  };

  const cancelRequest = async () => {
    try {
      const result = await axios.delete("/api/request/cancel", {
        data: {
          id: intersectSentRequests[0],
        },
        headers: {
          Authorization: data.accessToken.current,
        },
      });
      const newSentRequestArray = user.sentRequests.filter(
        (value) => value !== intersectSentRequests[0]
      );
      setUser({ ...user, sentRequests: newSentRequestArray });
      setIntersectSentRequests([]);
    } catch (error) {
      console.log(error);
    }
  };

  const declineRequest = async () => {
    try {
      const result = await axios.delete("/api/request/cancel", {
        data: {
          id: intersectRequests[0],
        },
        headers: {
          Authorization: data.accessToken.current,
        },
      });
      const newRequestArray = user.requests.filter(
        (value) => value !== intersectRequests[0]
      );
      setUser({ ...user, requests: newRequestArray });
      setIntersectRequests([]);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async () => {
    try {
      const result = await axios.post(
        "/api/request/reply",
        {
          id: intersectRequests[0],
        },
        {
          headers: {
            Authorization: data.accessToken.current,
          },
        }
      );
      const newRequestArray = user.requests.filter(
        (value) => value !== intersectRequests[0]
      );

      setUser({
        ...user,
        groupList: [...user.groupList, result.data.createdGroup._id],
        friendList: [...user.friendList, result.data.friendUser._id],
        requests: newRequestArray,
      });
      setIntersectRequests([]);
      setAlreadyFriend(true);
    } catch (error) {
      console.log(error);
    }
  };

  const unfriend = async () => {
    try {
      const result = await axios.patch(
        "/api/user/unfriend",
        {
          id: user._id,
          friendId: resultUser._id,
        },
        {
          headers: {
            Authorization: data.accessToken.current,
          },
        }
      );

      setUser(result.data.newUser);
      setAlreadyFriend(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <FaRegUserCircle></FaRegUserCircle>
      <h3>{resultUser.name}</h3>
      {alreadyFriend ? (
        <button type="button" onClick={unfriend}>
          Unfriend
        </button>
      ) : intersectRequests.length !== 0 ? (
        <div>
          <button type="button" onClick={acceptRequest}>
            Accept request
          </button>
          <button type="button" onClick={declineRequest}>
            Decline
          </button>
        </div>
      ) : intersectSentRequests.length !== 0 ? (
        <button type="button" onClick={cancelRequest}>
          Cancel request
        </button>
      ) : (
        <button type="button" onClick={(e) => setModal(true)}>
          Send request
        </button>
      )}
      {modal && (
        <div className={styles.modal}>
          <h3>Send request</h3>
          <button
            type="button"
            onClick={(e) => {
              setModal(false);
              setMessage("");
            }}
          >
            Close
          </button>
          <form onSubmit={sendRequest}>
            <input
              type="text"
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SearchResultTile;
