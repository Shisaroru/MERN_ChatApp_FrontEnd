import { useState, useContext, useEffect } from 'react'
import axios from 'axios';

import { GlobalState } from '../../GlobalState'

import GroupTile from '../GroupTile/GroupTile';

import styles from './GroupList.module.css';

function GroupList() {
    const [groups, setGroups] = useState([]);

    const data = useContext(GlobalState);
    const user = data.user.current;

    useEffect(() => {
        async function getGroups() {
            const response = await axios.post('/api/group/all', {
                "groupList": user.groupList,
            });

            console.log(response.data.result);
            setGroups(response.data.result);
        } 
        getGroups();
    }, []);

    return (
        <div className={styles.container}>
            {
                groups.map((group) => {
                    return (
                        <GroupTile key={group._id} groupData={group}></GroupTile>
                    );
                })
            }
        </div>
    )
}

export default GroupList