import styles from './Auth.module.css'

import LoginForm from '../../components/AuthForm/LoginForm'

function Login() {
  return (
    <section id={styles.container}>
      <LoginForm></LoginForm>
    </section>
  )
}

export default Login