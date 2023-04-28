import { createContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const GlobalState = createContext();

function DataProvider(props) {
  const accessToken = useRef("");
  const user = useRef({});
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

    socket.current = io("ws://localhost:8080");
    getAccessToken();
  }, []);

  const data = {
    accessToken,
    user,
    loginStatus: [login, setLogin],
  };

  return (
    <GlobalState.Provider value={data}>{props.children}</GlobalState.Provider>
  );
}

export default DataProvider;
