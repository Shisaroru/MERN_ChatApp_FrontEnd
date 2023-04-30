import { createContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const GlobalState = createContext();

function DataProvider(props) {
  const accessToken = useRef("");
  const user = useRef({});
  const [groups, setGroups] = useState([]);
  const [login, setLogin] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    async function getAccessToken() {
      try {
        const result = await axios.post("/api/user/refresh_token");
        accessToken.current = result.data.accessToken;
        user.current = result.data.user;

        setLogin(true);
      } catch (err) {
        console.log(err);
      }
    }

    getAccessToken();
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const groupsResponse = await axios.post("/api/group/all", {
          groupList: user.current.groupList,
        });

        if (socket.current === null) {
          socket.current = io("ws://localhost:8080", {
            auth: {
              token: accessToken.current,
            },
          });
        }
        socket.current.on("connect_error", (err) => {
          console.log(err.message); // prints the message associated with the error
        });

        socket.current.emit("joined_groups", groupsResponse.data.result);

        setGroups(groupsResponse.data.result);

        return () => {
          socket.current.disconnect();
          socket.current.removeAllListeners("connect_error");
        };
      } catch (error) {
        console.log(error);
      }
    }

    initialize();
  }, [login]);

  const data = {
    accessToken,
    user,
    groupsData: [groups, setGroups],
    loginStatus: [login, setLogin],
    socket,
  };

  return (
    <GlobalState.Provider value={data}>{props.children}</GlobalState.Provider>
  );
}

export default DataProvider;
