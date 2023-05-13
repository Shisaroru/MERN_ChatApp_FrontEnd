import { useRef, useContext, useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import TimeAgo from "timeago-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { GlobalState } from "../../GlobalState";

import styles from "./GroupTile.module.css";

function GroupTile({ groupData }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;

  const groupName = useRef(groupData.name.split(","));
  const navigate = useNavigate();
  const params = useParams();
  const [active, setActive] = useState(styles.groupTile);
  const [notify, setNotify] = useState(false);
  const [notifyNumber, setNotifyNumber] = useState(0);

  useEffect(() => {
    async function doThing() {
      if (params.id === groupData._id) {
        setActive(styles.groupTile + " " + styles.groupTileBlue);
        const newNotifications = { ...user.notifications };
        delete newNotifications[params.id];
        await axios.patch(
          "/api/user/clearNotifications",
          {
            id: user._id,
            notify: params.id,
          },
          {
            headers: {
              Authorization: data.accessToken.current,
            },
          }
        );
        setUser({ ...user, notifications: { ...newNotifications } });
        setNotify(false);
        setNotifyNumber(0);
      } else {
        setActive(styles.groupTile);
      }
    }
    doThing();
  }, [params.id]);

  useEffect(() => {
    try {
      if (user.notifications[groupData._id]) {
        setNotifyNumber(user.notifications[groupData._id]);
        setNotify(true);
      }
    } catch (error) {}
  }, [user]);

  const changeGroup = (e) => {
    navigate(`/chat/${groupData._id}`);
  };

  return (
    <div
      className={active}
      onClick={changeGroup}
      style={{ fontWeight: notify ? "bolder" : "normal" }}
    >
      <FaRegUserCircle className={styles.groupIcon}></FaRegUserCircle>
      <div className={styles.groupText}>
        <p className={styles.groupName}>
          {groupName.current[0] === user.name
            ? groupName.current[1]
            : groupName.current[0]}
        </p>
        {notifyNumber ? (
          <span className={styles.notify}>
            <p>{notifyNumber}</p>
          </span>
        ) : null}
        <p className={styles.groupMessage}>
          {groupData.latestMessage || "You are now friends"}
          <TimeAgo
            datetime={groupData.updatedAt}
            className={styles.time}
          ></TimeAgo>
        </p>
      </div>
    </div>
  );
}

export default GroupTile;
