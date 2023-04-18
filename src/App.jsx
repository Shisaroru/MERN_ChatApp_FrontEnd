import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { GlobalState } from "./GlobalState";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MainPage from "./pages/MainPage/MainPage";

export default function App() {
  const data = useContext(GlobalState);

  console.log(data);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={data.accessToken.current ? <Navigate replace to="/chat"/> : <Login /> }/>
        <Route path="/register" exact element={data.accessToken.current ? <Navigate replace to="/chat"/> : <Register />} />
        <Route path="/chat" exact element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}