import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { GlobalState } from "./GlobalState";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MainPage from "./pages/MainPage/MainPage";
import Search from "./pages/Search/Search";

export default function App() {
  const data = useContext(GlobalState);
  const [login, setLogin] = data.loginStatus;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          exact
          element={login ? <Navigate replace to="/chat" /> : <Login />}
        />
        <Route
          path="/register"
          exact
          element={login ? <Navigate replace to="/chat" /> : <Register />}
        />
        <Route
          path="/chat/:id?"
          element={!login ? <Navigate replace to="/" /> : <MainPage />}
        />
        <Route
          path="/search"
          element={!login ? <Navigate replace to="/" /> : <Search />}
        />
      </Routes>
    </BrowserRouter>
  );
}
