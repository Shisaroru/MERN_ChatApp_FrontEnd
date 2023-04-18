import { useState, useRef } from 'react'

import styles from './Login.module.css'

import LoginForm from '../../components/LoginForm/LoginForm'

function Login() {
  return (
    <section id={styles.container}>
      <LoginForm></LoginForm>
    </section>
  )
}

export default Login