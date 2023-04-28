import { useState, useContext } from 'react'
import axios from 'axios';

import { GlobalState } from '../../GlobalState';

import styles from './ChatInput.module.css';

function ChatInput({ params }) {
    const data = useContext(GlobalState);
    const [message, setMessage] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/message/send', {
                "sender": data.user.current._id,
                "senderName": data.user.current.name,
                "message": message,
                "groupId": params,
            });
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form action="" className={styles.container} onSubmit={sendMessage}>
            <input type="text" name="sendMessage" id="sendMessage" value={message} onChange={(e) => {setMessage(e.target.value)}} autoComplete='off' placeholder='Send message'/>
        </form>
    )
}

export default ChatInput