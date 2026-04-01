import styles from './BarChart.module.css'

const FALLBACK = [
  { month: 'Jan', purchase: 0, sales: 0 },
  { month: 'Feb', purchase: 0, sales: 0 },
  { month: 'Mar', purchase: 0, sales: 0 },
]

const MAX_VAL_MIN = 1000
const Y_LABELS_COUNT = 7
const CHART_H = 220
const BAR_W = 14
const BAR_GAP = 4
const GROUP_GAP = 22
const LEFT_PAD = 56
const TOP_PAD = 10
const BOTTOM_PAD = 28

function BarChart({ data }) {
  const chartData = (data && data.length > 0) ? data : FALLBACK
  const maxVal = Math.max(MAX_VAL_MIN, ...chartData.map(d => Math.max(d.purchase, d.sales)))
  const roundedMax = Math.ceil(maxVal / 10000) * 10000

  const yLabels = []
  for (let i = Y_LABELS_COUNT - 1; i >= 0; i--) {
    yLabels.push(Math.round((i / (Y_LABELS_COUNT - 1)) * roundedMax))
  }

  const totalW = LEFT_PAD + chartData.length * (BAR_W * 2 + BAR_GAP + GROUP_GAP)

  return (
    <div className={styles.wrapper}>
      <svg viewBox={`0 0 ${totalW} ${CHART_H + TOP_PAD + BOTTOM_PAD}`} width="100%" preserveAspectRatio="xMidYMid meet">
        {yLabels.map((val, i) => {
          const y = TOP_PAD + (i / (yLabels.length - 1)) * CHART_H
          return (
            <g key={i}>
              <line x1={LEFT_PAD} y1={y} x2={totalW - 10} y2={y} stroke="#e5e7eb" strokeWidth="0.8" />
              <text x={LEFT_PAD - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
                {val === 0 ? '0' : val >= 1000 ? `${val / 1000}k` : val}
              </text>
            </g>
          )
        })}
        {chartData.map((d, i) => {
          const groupX = LEFT_PAD + i * (BAR_W * 2 + BAR_GAP + GROUP_GAP) + GROUP_GAP / 2
          const purchaseH = roundedMax > 0 ? (d.purchase / roundedMax) * CHART_H : 0
          const salesH = roundedMax > 0 ? (d.sales / roundedMax) * CHART_H : 0
          const baseY = TOP_PAD + CHART_H
          return (
            <g key={i}>
              <rect x={groupX} y={baseY - purchaseH} width={BAR_W} height={purchaseH} fill="#a5b4fc" rx="3" />
              <rect x={groupX + BAR_W + BAR_GAP} y={baseY - salesH} width={BAR_W} height={salesH} fill="#4ade80" rx="3" />
              <text x={groupX + BAR_W} y={baseY + 16} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.month}</text>
            </g>
          )
        })}
      </svg>
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#a5b4fc' }} />Purchase</span>
        <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#4ade80' }} />Sales</span>
      </div>
    </div>
  )
}

export default BarChart
