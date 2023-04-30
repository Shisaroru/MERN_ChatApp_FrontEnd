import { useContext, useEffect } from "react";

import { GlobalState } from "../../GlobalState";

import GroupTile from "../GroupTile/GroupTile";

import styles from "./GroupList.module.css";

function GroupList() {
  const data = useContext(GlobalState);
  const [groups, setGroups] = data.groupsData;

  useEffect(() => {
    function updatedGroups(arg) {
      console.log("Event fired");
      const newGroups = groups;
      if (!newGroups) {
        return;
      }
      console.log(newGroups);
      const index = newGroups.findIndex(
        (element) => element.receiver === arg.receiver
      );

      const [removeElement] = newGroups.splice(index, 1);

      removeElement.latestMessage = arg.message;
      removeElement.updatedAt = arg.createdAt;
      console.log(removeElement, newGroups);

      setGroups([removeElement, ...newGroups]);
    }

    data.socket.current.on("newMessage", updatedGroups);
    data.socket.current.on("newGroup", updatedGroups);

    return () => {
      data.socket.current.off("newGroup", updatedGroups);
      data.socket.current.off("newMessage", updatedGroups);
    };
  }, [groups]);

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
