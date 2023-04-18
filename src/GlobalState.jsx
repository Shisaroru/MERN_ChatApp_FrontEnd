import { createContext, useRef, useEffect } from 'react'
import axios from 'axios';

export const GlobalState = createContext();

function DataProvider(props) {
  let accessToken = useRef("");
  let user = useRef({});

  useEffect(() => {
    async function getAccessToken() {
      const result = await axios.post("/api/user/refresh_token");
      accessToken.current = result.data.accessToken;
      user.current = result.data.user;
    };

    getAccessToken();
  }, [])

  const data = {
    accessToken,
    user,
  };

  return (
    <GlobalState.Provider value={data}>
      {props.children}
    </GlobalState.Provider>
  )
}

export default DataProvider