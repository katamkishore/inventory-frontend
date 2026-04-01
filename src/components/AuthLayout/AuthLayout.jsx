import styles from './AuthLayout.module.css'
import logo from '../../assets/logo.png'

function AuthLayout({ illustration, welcomeTitle, children }) {
  return (
    <div className={styles.page}>
      {/* Left Card */}
      <div className={styles.card}>
        {children}
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.welcomeText}>
          <h1>{welcomeTitle || 'Welcome to\nCompany Name'}</h1>
        </div>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.illustration}>
          <img src={illustration} alt="illustration" />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
