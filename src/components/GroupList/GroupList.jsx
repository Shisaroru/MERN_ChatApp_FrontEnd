import { useContext } from "react";
import axios from "axios";

import { GlobalState } from "../../GlobalState";

import GroupTile from "../GroupTile/GroupTile";

import styles from "./GroupList.module.css";

function GroupList() {
  const data = useContext(GlobalState);
  const [groups, setGroups] = data.groupsData;

  return (
    <div className={styles.container}>
      {groups
        ? groups.map((group) => {
            return <GroupTile key={group._id} groupData={group}></GroupTile>;
          })
        : null}
    </div>
  );
}

export default GroupList;
