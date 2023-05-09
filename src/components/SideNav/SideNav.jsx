import { useContext } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  FaRegUserCircle,
  FaCommentAlt,
  FaSearch,
  FaSignOutAlt,
  FaRegAddressBook,
} from "react-icons/fa";

import styles from "./SideNav.module.css";

import { GlobalState } from "../../GlobalState";

function SideNav() {
  const data = useContext(GlobalState);
  const [login, setLogin] = data.loginStatus;
  const [user, setUser] = data.user;
  const socket = data.socket;

  const signOut = async (e) => {
    data.accessToken.current = "";
    setUser({});
    socket.disconnect();
    await axios.post(`/api/user/logout`);
    setLogin(false);
  };

  return (
    <div id={styles.container}>
      <NavLink to="" className={styles.navLink}>
        <FaRegUserCircle></FaRegUserCircle>
      </NavLink>
      <NavLink
        to="/chat"
        className={({ isActive, isPending }) =>
          isActive
            ? styles.navLink + " " + styles.navLinkActive
            : styles.navLink
        }
      >
        <FaCommentAlt></FaCommentAlt>
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive, isPending }) =>
          isActive
            ? styles.navLink + " " + styles.navLinkActive
            : styles.navLink
        }
      >
        <FaRegAddressBook></FaRegAddressBook>
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive, isPending }) =>
          isActive
            ? styles.navLink + " " + styles.navLinkActive
            : styles.navLink
        }
      >
        <FaSearch></FaSearch>
      </NavLink>
      <button id={styles.signOut} type="button" onClick={signOut}>
        <FaSignOutAlt></FaSignOutAlt>
      </button>
    </div>
  );
}

export default SideNav;
