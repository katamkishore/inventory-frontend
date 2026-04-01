import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import styles from './DashboardLayout.module.css'

function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
