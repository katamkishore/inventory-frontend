import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import illustration from '../../assets/img5.png'
import { api } from '../../services/api'
import styles from './ResetPassword.module.css'

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.password || !form.confirmPassword) return
    if (form.password !== form.confirmPassword) return
    if (form.password.length < 8) return
    setLoading(true)
    try {
      await api.resetPassword({ email, password: form.password })
      navigate('/login')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout illustration={illustration}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Create New Password</h2>
        <p className={styles.subtitle}>Today is a new day. It's your day. You shape it. Sign in to start managing your projects.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Enter New Password</label>
            <div className={styles.inputWrapper}>
              <input type={showNew ? 'text' : 'password'} placeholder="at least 8 characters"
                className={styles.input} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowNew(p => !p)}>
                {showNew ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <input type={showConfirm ? 'text' : 'password'} placeholder="at least 8 characters"
                className={styles.input} value={form.confirmPassword}
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <div className={styles.forgotRow}>
              <span className={styles.forgotLink} onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}

function EyeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
}
function EyeOffIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
}
export default ResetPassword
