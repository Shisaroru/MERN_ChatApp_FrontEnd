import SideNav from '../../components/SideNav/SideNav';
import GroupList from '../../components/GroupList/GroupList';
import ChatBox from '../../components/ChatBox/ChatBox';

import styles from './MainPage.module.css';

function MainPage() {
  return (
    <section id={styles.grid_container}>
      <SideNav></SideNav>
      <GroupList></GroupList>
      <ChatBox></ChatBox>
    </section>
  )
}

export default MainPage