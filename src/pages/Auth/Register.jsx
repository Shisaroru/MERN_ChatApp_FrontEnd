import styles from './Auth.module.css'

import RegisterForm from '../../components/AuthForm/RegisterForm'

function Register() {
  return (
    <section id={styles.container}>
      <RegisterForm></RegisterForm>
    </section>
  )
}

export default Register