import { useRef, useContext } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import TimeAgo from 'timeago-react';

import { GlobalState } from '../../GlobalState';

import styles from './GroupTile.module.css';

function GroupTile({ groupData }) {
    const data = useContext(GlobalState);
    const groupName = useRef(groupData.name.split(','));


    console.log(groupData, data.user.current.name);
    return (
        <div className={styles.groupTile}>
            <FaRegUserCircle className={styles.groupIcon}></FaRegUserCircle>
            <div className={styles.groupText}>
                <p className={styles.groupName}>
                    {(groupName.current[0] === data.user.current.name) ? groupName.current[1] : groupName.current[0]}
                </p>
                <p className={styles.groupMessage}>
                    {groupData.latestMessage || "You are now friends"}
                    <TimeAgo datetime={groupData.updatedAt} className={styles.time}></TimeAgo>
                </p>
            </div>
        </div>
    )
}

export default GroupTile