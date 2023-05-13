import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { GlobalState } from "../../GlobalState";

import GroupTile from "../GroupTile/GroupTile";

import styles from "./GroupList.module.css";

function GroupList() {
  const data = useContext(GlobalState);
  const [groups, setGroups] = data.groupsData;
  const [user, setUser] = data.user;
  const params = useParams();

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
    function updatedGroupsNotifications(arg) {
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

      console.log(params.id, arg, user);

      if (params.id !== arg.receiver) {
        const newObject = { ...user.notifications };
        if (newObject[arg.receiver]) {
          newObject[arg.receiver]++;
        } else {
          newObject[arg.receiver] = 1;
        }
        setUser({
          ...user,
          notifications: { ...newObject },
        });
      }

      setGroups([removeElement, ...newGroups]);
    }
    if (data.socket) {
      data.socket.on("newMessage", updatedGroupsNotifications);
      data.socket.on("newGroup", updatedGroups);
    }

    return () => {
      if (data.socket) {
        data.socket.off("newGroup", updatedGroups);
        data.socket.off("newMessage", updatedGroupsNotifications);
      }
    };
  }, [groups, data.socket, params.id]);

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
