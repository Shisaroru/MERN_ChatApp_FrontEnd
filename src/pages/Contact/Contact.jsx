import { useState, useContext } from "react";
import {
  FaRegEnvelopeOpen,
  FaRegEnvelope,
  FaReply,
  FaShare,
  FaUsers,
} from "react-icons/fa";

import { GlobalState } from "../../GlobalState";

import SideNav from "../../components/SideNav/SideNav";
import RequestTile from "../../components/RequestTile/RequestTile";
import FriendTile from "../../components/FriendTile/FriendTile";

import styles from "./Contact.module.css";

function Contact() {
  const [showRequests, setShowRequests] = useState(false);
  const [showSentRequests, setShowSentRequests] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const data = useContext(GlobalState);
  const [user, setUser] = data.user;

  return (
    <section id={styles.grid_container}>
      <SideNav></SideNav>
      <div className={styles.optionsContainer}>
        <div
          className={
            styles.option + " " + (showContacts ? styles.active : null)
          }
          onClick={() => {
            setShowRequests(false);
            setShowSentRequests(false);
            setShowContacts(true);
          }}
        >
          <div className={styles.icon}>
            <FaUsers></FaUsers>
          </div>
          <p>Contacts</p>
        </div>
        <div
          className={
            styles.option + " " + (showRequests ? styles.active : null)
          }
          onClick={() => {
            setShowRequests(true);
            setShowSentRequests(false);
            setShowContacts(false);
          }}
        >
          <div className={styles.icon}>
            <FaReply></FaReply>
            <FaRegEnvelopeOpen></FaRegEnvelopeOpen>
          </div>
          <p>Requests</p>
        </div>
        <div
          className={
            styles.option + " " + (showSentRequests ? styles.active : null)
          }
          onClick={() => {
            setShowSentRequests(true);
            setShowRequests(false);
            setShowContacts(false);
          }}
        >
          <div className={styles.icon}>
            <FaRegEnvelope></FaRegEnvelope>
            <FaShare></FaShare>
          </div>
          <p>Sent requests</p>
        </div>
      </div>
      <div className={styles.result}>
        {showRequests
          ? user.requests.map((value) => {
              return (
                <RequestTile
                  key={value}
                  request={value}
                  sentByMe={false}
                ></RequestTile>
              );
            })
          : showSentRequests
          ? user.sentRequests.map((value) => {
              return (
                <RequestTile
                  key={value}
                  request={value}
                  sentByMe={true}
                ></RequestTile>
              );
            })
          : showContacts
          ? user.friendList.map((value) => {
              return <FriendTile key={value} id={value}></FriendTile>;
            })
          : null}
      </div>
    </section>
  );
}

export default Contact;
