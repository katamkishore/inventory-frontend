import { useState, useEffect, useRef } from 'react'
import { api } from '../../services/api'
import BarChart from '../../components/BarChart/BarChart'
import styles from './Statistics.module.css'

const CARD_DEFS = {
  revenue: {
    key: 'revenue',
    label: 'Total Revenue',
    cls: 'yellow',
    icon: '₹',
    format: (v) => `₹${Number(v).toLocaleString('en-IN')}`,
    change: '+20.1% from last month',
  },
  sold: {
    key: 'sold',
    label: 'Products Sold',
    cls: 'teal',
    icon: <GridIcon />,
    format: (v) => Number(v).toLocaleString('en-IN'),
    change: '+180.1% from last month',
  },
  stock: {
    key: 'stock',
    label: 'Products In Stock',
    cls: 'pink',
    icon: <TrendIcon />,
    format: (v) => Number(v).toLocaleString('en-IN'),
    change: '+19% from last month',
  },
}

function Stars({ count }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(i => <span key={i} className={i <= count ? styles.starFilled : styles.starEmpty}>★</span>)}
    </div>
  )
}

function getStars(salesCount) {
  if (salesCount >= 100) return 5
  if (salesCount >= 50) return 4
  if (salesCount >= 20) return 3
  if (salesCount >= 5) return 2
  return 1
}

export default function Statistics() {
  const [stats, setStats] = useState({ totalRevenue: 0, productsSold: 0, productsInStock: 0, chartData: [], topProducts: [], cardOrder: ['revenue', 'sold', 'stock'] })
  const [cardOrder, setCardOrder] = useState(['revenue', 'sold', 'stock'])
  const [loading, setLoading] = useState(true)
  const dragIdx = useRef(null)

  useEffect(() => {
    api.getStatistics()
      .then(data => {
        setStats(data)
        if (data.cardOrder?.length === 3) setCardOrder(data.cardOrder)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  function getCardValue(key) {
    if (key === 'revenue') return stats.totalRevenue
    if (key === 'sold') return stats.productsSold
    return stats.productsInStock
  }

  function handleDragStart(idx) { dragIdx.current = idx }

  function handleDragOver(e, idx) {
    e.preventDefault()
    if (dragIdx.current === null || dragIdx.current === idx) return
    const newOrder = [...cardOrder]
    const [dragged] = newOrder.splice(dragIdx.current, 1)
    newOrder.splice(idx, 0, dragged)
    dragIdx.current = idx
    setCardOrder(newOrder)
  }

  function handleDragEnd() {
    dragIdx.current = null
    api.updateCardOrder({ order: cardOrder }).catch(() => {})
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1 className={styles.pageTitle}>Statistics</h1></div>
      <div className={styles.content}>
        {loading ? <p style={{ color: '#9ca3af', padding: 24 }}>Loading statistics...</p> : (
          <>
            <div className={styles.statsRow}>
              {cardOrder.map((key, idx) => {
                const def = CARD_DEFS[key]
                return (
                  <div key={key} className={`${styles.statCard} ${styles[def.cls]}`}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={e => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className={styles.statCardTop}>
                      <span className={styles.statCardLabel}>{def.label}</span>
                      <span className={styles.statCardIcon}>{def.icon}</span>
                    </div>
                    <p className={styles.statCardValue}>{def.format(getCardValue(key))}</p>
                    <p className={styles.statCardChange}>{def.change}</p>
                  </div>
                )
              })}
            </div>

            <div className={styles.bottomRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h2 className={styles.cardTitle}>Sales &amp; Purchase</h2>
                  <button className={styles.weeklyBtn}><CalendarIcon /> Weekly</button>
                </div>
                <BarChart data={stats.chartData} />
              </div>
              <div className={styles.topCard}>
                <h2 className={styles.cardTitle}>Top Products</h2>
                <div className={styles.productList}>
                  {stats.topProducts.length === 0 ? <p style={{ color: '#9ca3af', fontSize: 13 }}>No sales yet</p>
                    : stats.topProducts.map((p, i) => (
                      <div key={p.name + i}>
                        <div className={styles.productRow}>
                          <span className={styles.productName}>{p.name}</span>
                          <Stars count={getStars(p.salesCount)} />
                        </div>
                        {i < stats.topProducts.length - 1 && <div className={styles.productDivider} />}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function GridIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> }
function TrendIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> }
function CalendarIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
