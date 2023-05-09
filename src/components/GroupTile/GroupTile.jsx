import { useRef, useContext, useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import TimeAgo from "timeago-react";
import { useNavigate, useParams } from "react-router-dom";

import { GlobalState } from "../../GlobalState";

import styles from "./GroupTile.module.css";

function GroupTile({ groupData }) {
  const data = useContext(GlobalState);
  const [user, setUser] = data.user;

  const groupName = useRef(groupData.name.split(","));
  const navigate = useNavigate();
  const params = useParams();
  const [active, setActive] = useState(styles.groupTile);

  useEffect(() => {
    if (params.id === groupData._id) {
      setActive(styles.groupTile + " " + styles.groupTileBlue);
    } else {
      setActive(styles.groupTile);
    }
  }, [params.id]);

  const changeGroup = (e) => {
    navigate(`/chat/${groupData._id}`);
  };

  return (
    <div className={active} onClick={changeGroup}>
      <FaRegUserCircle className={styles.groupIcon}></FaRegUserCircle>
      <div className={styles.groupText}>
        <p className={styles.groupName}>
          {groupName.current[0] === user.name
            ? groupName.current[1]
            : groupName.current[0]}
        </p>
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
