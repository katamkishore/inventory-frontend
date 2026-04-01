import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import illustration from '../../assets/img4.png'
import { api } from '../../services/api'
import styles from './OTPVerification.module.css'

function OTPVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!otp) return
    setLoading(true)
    try {
      await api.verifyOTP({ email, otp })
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout illustration={illustration}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Enter Your OTP</h2>
        <p className={styles.subtitle}>
          We've sent a 6-digit OTP to your registered mail.<br />
          Please enter it below to sign in.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>OTP</label>
            <input type="text" placeholder="Enter OTP" maxLength={6}
              className={styles.input} value={otp} onChange={e => setOtp(e.target.value)} />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Verifying...' : 'Confirm'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
export default OTPVerification
