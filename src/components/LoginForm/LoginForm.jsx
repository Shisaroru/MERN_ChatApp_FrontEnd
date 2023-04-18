import { useState } from 'react'
import axios from 'axios'

import styles from './LoginForm.module.css'

function LoginForm() {
    const [payloads, setPayloads] = useState({
        email: "",
        password: "",
    })

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post("/api/user/login", payloads);
            console.log(result.data);
        } catch (error) {
            console.log(error.response.data);
        }
        
    }

    return (
        <form action="#" method='POST' onSubmit={submitHandler} className={styles.form_container}>
            <h2>Login</h2>
            <div className={styles.input_container}>
                <label htmlFor="email" className={styles.input_label}>Email</label>
                <input type="email" name="email" className={styles.input_field} id="email" value={payloads.email} required
                    onChange={e => setPayloads({...payloads, email: e.target.value})}
                />
            </div>
            <div className={styles.input_container}>
                <label htmlFor="password" className={styles.input_label}>Password</label>
                <input type="password" name="password" className={styles.input_field} id="password" value={payloads.password} required
                    onChange={e => setPayloads({...payloads, password: e.target.value})}
                />
            </div>
            <div className={styles.form_options}>
                <div>
                    <input type="checkbox" name="remember" id="remember" value="true"/>
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div>
                    <a href="#">Forgot password?</a>
                </div>
            </div>
            <button type='submit' id={styles.submitBtn}>
                Login
            </button>
            <div>
                Don't have an account yet?
                <a href="#" id={styles.register}>Register</a>
            </div>
        </form>
    )
}

export default LoginForm