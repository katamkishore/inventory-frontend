import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout/AuthLayout'
import illustration from '../../assets/img1_2.png'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import styles from './SignUp.module.css'

function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  function set(field) { return e => setForm(p => ({ ...p, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.password) return
    if (form.password !== form.confirmPassword) return
    if (form.password.length < 8) return
    setLoading(true)
    try {
      const data = await api.register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password })
      login(data.user, data.token)
      navigate('/home')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout illustration={illustration} welcomeTitle={'Welcome to\nCompany Name'}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Create an account</h2>
        <p className={styles.subtitle}>Start inventory management.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Name</label>
            <input type="text" placeholder="First name" className={styles.input} value={form.firstName} onChange={set('firstName')} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Last name</label>
            <input type="text" placeholder="Last name" className={styles.input} value={form.lastName} onChange={set('lastName')} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" placeholder="Example@email.com" className={styles.input} value={form.email} onChange={set('email')} />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Create Password</label>
            <div className={styles.inputWrapper}>
              <input type={showPassword ? 'text' : 'password'} placeholder="at least 8 characters"
                className={styles.input} value={form.password} onChange={set('password')} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <input type={showConfirm ? 'text' : 'password'} placeholder="at least 8 characters"
                className={styles.input} value={form.confirmPassword} onChange={set('confirmPassword')} />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>
        <p className={styles.switchText}>
          Do you have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
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
export default SignUp
