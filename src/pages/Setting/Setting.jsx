import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import styles from './Setting.module.css'

function Setting() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getSettings()
      .then(data => setForm(f => ({ ...f, firstName: data.firstName, lastName: data.lastName, email: data.email })))
      .catch(err => console.error(err))
  }, [])

  function set(field) { return e => setForm(p => ({ ...p, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const body = { firstName: form.firstName, lastName: form.lastName }
      if (form.password) { body.password = form.password; body.confirmPassword = form.confirmPassword }
      const data = await api.updateSettings(body)
      updateUser(data.user)
      setForm(f => ({ ...f, password: '', confirmPassword: '' }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1 className={styles.pageTitle}>Setting</h1></div>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.tabRow}><span className={styles.activeTab}>Edit Profile</span></div>
          <div className={styles.divider} />
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>First name</label>
              <input className={styles.input} type="text" value={form.firstName} onChange={set('firstName')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Last name</label>
              <input className={styles.input} type="text" value={form.lastName} onChange={set('lastName')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" value={form.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Email cannot be changed</p>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <input className={styles.input} type="password" placeholder="Enter new password (optional)" value={form.password} onChange={set('password')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input className={styles.input} type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={set('confirmPassword')} />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Setting
