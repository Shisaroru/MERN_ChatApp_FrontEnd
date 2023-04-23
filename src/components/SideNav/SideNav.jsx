import { useContext } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FaRegUserCircle, FaCommentAlt, FaSearch, FaSignOutAlt, FaRegAddressBook } from 'react-icons/fa';

import styles from './SideNav.module.css';

import { GlobalState } from '../../GlobalState';

function SideNav() {

  const data = useContext(GlobalState);
  const [login, setLogin] = data.loginStatus;

  const signOut = async (e) => {
    data.accessToken.current = "";
    data.user.current = {};
    await axios.post(`/api/user/logout`);
    setLogin(false);
  };

  return (
    <div id={styles.container}>
        <NavLink to="">
          <FaRegUserCircle></FaRegUserCircle>
        </NavLink>
        <NavLink to="">
          <FaCommentAlt></FaCommentAlt>
        </NavLink>
        <NavLink to="">
          <FaRegAddressBook></FaRegAddressBook>
        </NavLink>
        <NavLink to="">
          <FaSearch></FaSearch>
        </NavLink>
        <button id={styles.signOut} type="button" onClick={signOut}>
          <FaSignOutAlt></FaSignOutAlt>
        </button>
    </div>
  )
}

export default SideNav