import { createContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const GlobalState = createContext();

function DataProvider(props) {
  const accessToken = useRef("");
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [login, setLogin] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    async function getAccessToken() {
      try {
        const result = await axios.post("/api/user/refresh_token");
        accessToken.current = result.data.accessToken;
        setUser(result.data.user);

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
          groupList: user.groupList,
        });

        if (socket === null && accessToken.current !== "") {
          const newSocket = io("ws://localhost:8080", {
            auth: {
              token: accessToken.current,
            },
          });

          newSocket.on("connect_error", (err) => {
            console.log(err.message); // prints the message associated with the error
          });

          newSocket.emit("joined_groups", groupsResponse.data.result);
          setSocket(newSocket);
        }

        setGroups(groupsResponse.data.result);

        return () => {
          console.log("Clean up GlobalState");
          if (socket) {
            socket.disconnect();
            socket.removeAllListeners("connect_error");
          }
        };
      } catch (error) {
        console.log(error);
      }
    }

    initialize();
  }, [login, user]);

  const data = {
    accessToken,
    user: [user, setUser],
    groupsData: [groups, setGroups],
    loginStatus: [login, setLogin],
    socket,
  };

  return (
    <GlobalState.Provider value={data}>{props.children}</GlobalState.Provider>
  );
}

export default DataProvider;
