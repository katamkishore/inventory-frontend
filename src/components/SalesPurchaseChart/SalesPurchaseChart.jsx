import { useId } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './SalesPurchaseChart.module.css'

const FALLBACK = [
  { month: 'Jan', purchase: 0, sales: 0 },
  { month: 'Feb', purchase: 0, sales: 0 },
  { month: 'Mar', purchase: 0, sales: 0 },
  { month: 'Apr', purchase: 0, sales: 0 },
  { month: 'May', purchase: 0, sales: 0 },
  { month: 'Jun', purchase: 0, sales: 0 },
  { month: 'Jul', purchase: 0, sales: 0 },
  { month: 'Aug', purchase: 0, sales: 0 },
  { month: 'Sep', purchase: 0, sales: 0 },
]

function SalesPurchaseChart({ data }) {
  const chartData = data?.length ? data : FALLBACK
  const gradId = `purchaseGrad-${useId().replace(/:/g, '')}`

  return (
    <div className={styles.wrap}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 4, bottom: 8 }}
          barGap={6}
          barCategoryGap="20%"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="45%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
            width={44}
          />
          <Tooltip
            cursor={{ fill: 'rgba(243, 244, 246, 0.6)' }}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            }}
            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
          />
          <Legend
            wrapperStyle={{ paddingTop: 8 }}
            iconType="circle"
            formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
          />
          <Bar
            dataKey="purchase"
            name="Purchase"
            fill={`url(#${gradId})`}
            radius={[5, 5, 0, 0]}
            maxBarSize={36}
          />
          <Bar dataKey="sales" name="Sales" fill="#16a34a" radius={[5, 5, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesPurchaseChart
