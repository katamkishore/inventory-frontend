import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import illustration from '../../assets/img3.png'
import { api } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import styles from './ForgotPassword.module.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const data = await api.forgotPassword({ email })
      if (data?.otp != null) addToast(`Your OTP is: ${data.otp}`, 'otp')
      navigate('/otp-verification', { state: { email } })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout illustration={illustration}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Company name</h2>
        <p className={styles.subtitle}>Please enter your registered email ID to receive an OTP</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>E-mail</label>
            <input type="email" placeholder="Enter your registered email"
              className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Sending...' : 'Send Mail'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
export default ForgotPassword
