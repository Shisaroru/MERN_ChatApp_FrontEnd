import { useState, useContext } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

import styles from './AuthForm.module.css'

import { GlobalState } from '../../GlobalState'

function LoginForm() {
    const [payloads, setPayloads] = useState({
        email: "",
        password: "",
    })

    const data = useContext(GlobalState);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post("/api/user/login", payloads);
            console.log(result.data);
            data.accessToken.current = result.data.accessToken;
            data.user.current = result.data.user;
            console.log(data);
            return navigate("/chat");
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
                <Link to="/register" id={styles.navigate}>Register</Link>
            </div>
        </form>
    )
}

export default LoginForm