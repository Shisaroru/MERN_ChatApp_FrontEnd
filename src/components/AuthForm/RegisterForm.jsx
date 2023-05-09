import { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import styles from "./AuthForm.module.css";

import { GlobalState } from "../../GlobalState";

function RegisterForm() {
  const [payloads, setPayloads] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const data = useContext(GlobalState);
  const [login, setLogin] = data.loginStatus;
  const [user, setUser] = data.user;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/user/register", payloads);
      console.log(result.data);
      data.accessToken.current = result.data.accessToken;
      setUser(result.data.user);
      setLogin(true);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <form
      action="#"
      method="POST"
      onSubmit={submitHandler}
      className={styles.form_container}
    >
      <h2>Register</h2>
      <div className={styles.input_container}>
        <label htmlFor="name" className={styles.input_label}>
          Name
        </label>
        <input
          type="text"
          name="name"
          className={styles.input_field}
          id="name"
          value={payloads.name}
          required
          onChange={(e) => setPayloads({ ...payloads, name: e.target.value })}
        />
      </div>
      <div className={styles.input_container}>
        <label htmlFor="email" className={styles.input_label}>
          Email
        </label>
        <input
          type="email"
          name="email"
          className={styles.input_field}
          id="email"
          value={payloads.email}
          required
          onChange={(e) => setPayloads({ ...payloads, email: e.target.value })}
        />
      </div>
      <div className={styles.input_container}>
        <label htmlFor="phoneNumber" className={styles.input_label}>
          Phone number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          className={styles.input_field}
          id="phoneNumber"
          value={payloads.phoneNumber}
          required
          onChange={(e) =>
            setPayloads({ ...payloads, phoneNumber: e.target.value })
          }
        />
      </div>
      <div className={styles.input_container}>
        <label htmlFor="password" className={styles.input_label}>
          Password
        </label>
        <input
          type="password"
          name="password"
          className={styles.input_field}
          id="password"
          value={payloads.password}
          required
          onChange={(e) =>
            setPayloads({ ...payloads, password: e.target.value })
          }
        />
      </div>
      <button type="submit" id={styles.submitBtn}>
        Register
      </button>
      <div>
        Already have an account ?
        <Link to="/" id={styles.navigate}>
          Login
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;
