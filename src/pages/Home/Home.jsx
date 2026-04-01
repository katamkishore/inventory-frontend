import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import SalesPurchaseChart from '../../components/SalesPurchaseChart/SalesPurchaseChart'
import styles from './Home.module.css'

const DEFAULT = {
  salesOverview: { sales: 0, revenue: 0, profit: 0, cost: 0 },
  purchaseOverview: { purchase: 0, cost: 0, cancel: 0, return: 0 },
  inventorySummary: { inStock: 0, toBeReceived: 0 },
  productSummary: { suppliers: 0, categories: 0 },
  topProducts: [],
  chartData: [],
}

export default function Home() {
  const [data, setData] = useState(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const { salesOverview: so, purchaseOverview: po, inventorySummary: inv, productSummary: ps } = data

  const salesStats = [
    { label: 'Sales', value: so.sales, icon: <SalesIcon />, color: '#dbeafe', iconBg: '#3b82f6' },
    { label: 'Revenue', value: `₹ ${so.revenue.toLocaleString('en-IN')}`, icon: <RevenueIcon />, color: '#fef9c3', iconBg: '#eab308' },
    { label: 'Profit', value: `₹ ${so.profit.toLocaleString('en-IN')}`, icon: <ProfitIcon />, color: '#ccfbf1', iconBg: '#14b8a6' },
    { label: 'Cost', value: `₹ ${so.cost.toLocaleString('en-IN')}`, icon: <CostIcon />, color: '#f3e8ff', iconBg: '#a855f7' },
  ]
  const purchaseStats = [
    { label: 'Purchase', value: po.purchase, icon: <PurchaseIcon />, color: '#dbeafe', iconBg: '#3b82f6' },
    { label: 'Cost', value: `₹ ${po.cost.toLocaleString('en-IN')}`, icon: <WalletIcon />, color: '#fef9c3', iconBg: '#eab308' },
    { label: 'Cancel', value: po.cancel, icon: <CancelIcon />, color: '#ccfbf1', iconBg: '#14b8a6' },
    { label: 'Return', value: `₹${po.return.toLocaleString('en-IN')}`, icon: <ReturnIcon />, color: '#ede9fe', iconBg: '#8b5cf6' },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Home</h1>
      </header>
      {loading ? (
        <div className={styles.loading}>Loading dashboard...</div>
      ) : (
        <div className={styles.content}>
          <div className={styles.dashboardGrid}>
            <div className={styles.mainCol}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Sales Overview</h2>
                <div className={styles.statsRow}>
                  {salesStats.map(s => (
                    <div key={s.label} className={styles.statItem}>
                      <div className={styles.iconBox} style={{ background: s.color }}>
                        <span className={styles.iconInner} style={{ background: s.iconBg }}>{s.icon}</span>
                      </div>
                      <p className={styles.statValue}>{s.value}</p>
                      <p className={styles.statLabel}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Purchase Overview</h2>
                <div className={styles.statsRow}>
                  {purchaseStats.map(s => (
                    <div key={s.label} className={styles.statItem}>
                      <div className={styles.iconBox} style={{ background: s.color }}>
                        <span className={styles.iconInner} style={{ background: s.iconBg }}>{s.icon}</span>
                      </div>
                      <p className={styles.statValue}>{s.value}</p>
                      <p className={styles.statLabel}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.card}>
                <div className={styles.chartHeader}>
                  <h2 className={styles.cardTitle}>Sales &amp; Purchase</h2>
                  <button type="button" className={styles.weeklyBtn}>
                    <CalendarIcon /> Weekly
                  </button>
                </div>
                <SalesPurchaseChart data={data.chartData} />
              </section>
            </div>

            <aside className={styles.sideCol}>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Inventory Summary</h2>
                <div className={styles.summaryRow}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon} style={{ background: '#fef9c3' }}>
                      <span style={{ background: '#eab308' }} className={styles.iconInner}><PackageIcon /></span>
                    </div>
                    <p className={styles.summaryValue}>{inv.inStock}</p>
                    <p className={styles.summaryLabel}>In Stock</p>
                  </div>
                  <div className={styles.summaryDivider} />
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon} style={{ background: '#ccfbf1' }}>
                      <span style={{ background: '#14b8a6' }} className={styles.iconInner}><IncomingIcon /></span>
                    </div>
                    <p className={styles.summaryValue}>{inv.toBeReceived}</p>
                    <p className={styles.summaryLabel}>To be received</p>
                  </div>
                </div>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Product Summary</h2>
                <div className={styles.summaryRow}>
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon} style={{ background: '#fef9c3' }}>
                      <span style={{ background: '#eab308' }} className={styles.iconInner}><SupplierIcon /></span>
                    </div>
                    <p className={styles.summaryValue}>{ps.suppliers}</p>
                    <p className={styles.summaryLabel}>Number of<br />Suppliers</p>
                  </div>
                  <div className={styles.summaryDivider} />
                  <div className={styles.summaryItem}>
                    <div className={styles.summaryIcon} style={{ background: '#ccfbf1' }}>
                      <span style={{ background: '#14b8a6' }} className={styles.iconInner}><CategoryIcon /></span>
                    </div>
                    <p className={styles.summaryValue}>{ps.categories}</p>
                    <p className={styles.summaryLabel}>Number of<br />Categories</p>
                  </div>
                </div>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Top Products</h2>
                <div className={styles.topProductsList}>
                  {data.topProducts.map((name, i) => (
                    <div key={name + i}>
                      <div className={styles.topProductItem}><span>{name}</span></div>
                      {i < data.topProducts.length - 1 && <div className={styles.productDivider} />}
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      )}
    </div>
  )
}

function SalesIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> }
function RevenueIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> }
function ProfitIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> }
function CostIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> }
function PurchaseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> }
function WalletIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg> }
function CancelIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> }
function ReturnIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4" /></svg> }
function PackageIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg> }
function IncomingIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="8 17 12 21 16 17" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" /></svg> }
function SupplierIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> }
function CategoryIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> }
function CalendarIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> }
