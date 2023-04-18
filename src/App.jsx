import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalState from "./GlobalState";

import Login from "./pages/Login/Login";

export default function App() {
  return (
    // <GlobalState>
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/login" exact element={<Login />} />
    //     </Routes>
    //   </BrowserRouter>
    // </GlobalState>
    <Login></Login>
  );
}