import React from 'react';

import SideNav from '../../components/SideNav/SideNav';
import GroupList from '../../components/GroupList/GroupList';

import styles from './MainPage.module.css';

function MainPage() {
  return (
    <section id={styles.grid_container}>
      <SideNav></SideNav>
      <GroupList></GroupList>
    </section>
  )
}

export default MainPage