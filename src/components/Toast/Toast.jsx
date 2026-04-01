import styles from './Toast.module.css'

function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          <span className={styles.message}>{t.message}</span>
          <button className={styles.close} onClick={() => onRemove(t.id)}>×</button>
        </div>
      ))}
    </div>
  )
}

export default Toast
