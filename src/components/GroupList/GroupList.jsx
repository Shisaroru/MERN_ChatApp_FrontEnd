import { useContext, useEffect } from "react";

import { GlobalState } from "../../GlobalState";

import GroupTile from "../GroupTile/GroupTile";

import styles from "./GroupList.module.css";

function GroupList() {
  const data = useContext(GlobalState);
  const [groups, setGroups] = data.groupsData;

  useEffect(() => {
    function updatedGroups(arg) {
      const newGroups = groups;
      if (!newGroups) {
        return;
      }

      const index = newGroups.findIndex(
        (element) => element._id === arg.receiver
      );

      const [removeElement] = newGroups.splice(index, 1);

      removeElement.latestMessage = arg.message;
      removeElement.updatedAt = arg.createdAt;

      setGroups([removeElement, ...newGroups]);
    }
    if (data.socket) {
      data.socket.on("newMessage", updatedGroups);
      data.socket.on("newGroup", updatedGroups);
    }

    return () => {
      if (data.socket) {
        data.socket.off("newGroup", updatedGroups);
        data.socket.off("newMessage", updatedGroups);
      }
    };
  }, [groups, data.socket]);

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
