import { useState, useEffect, useCallback } from 'react'
import { api } from '../../services/api'
import styles from './Invoice.module.css'

const LIMIT = 10

function formatInvoiceDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`
}

function formatMoney(n) {
  const x = Number(n)
  if (Number.isNaN(x)) return '0'
  return x.toLocaleString('en-IN')
}

export default function Invoice() {
  const [invoices, setInvoices] = useState([])
  const [overallStats, setOverallStats] = useState({})
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewInvoice, setViewInvoice] = useState(null)
  const [menuOpen, setMenuOpen] = useState(null)
  const [confirmPaidPreviewId, setConfirmPaidPreviewId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getInvoices({ page, limit: LIMIT, search })
      setInvoices(data.invoices)
      setPages(data.pages)
      setOverallStats(data.overallStats || {})
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  async function handleMarkPaid(inv) {
    try {
      setInvoices(prev => prev.map(i => i._id === inv._id ? { ...i, status: 'Paid' } : i))
      await api.updateInvoice(inv._id, { status: 'Paid' })
      setMenuOpen(null)
      setConfirmPaidPreviewId(null)
      fetchInvoices()
    } catch (err) {
      console.error(err)
      fetchInvoices()
    }
  }

  function openMenu(invId) {
    if (menuOpen === invId) {
      setMenuOpen(null)
      setConfirmPaidPreviewId(null)
    } else {
      setMenuOpen(invId)
      setConfirmPaidPreviewId(null)
    }
  }

  function handleStatusPopupClick(inv, e) {
    e.stopPropagation()
    if (confirmPaidPreviewId === inv._id) {
      handleMarkPaid(inv)
    } else {
      setConfirmPaidPreviewId(inv._id)
    }
  }

  async function confirmDelete() {
    try {
      await api.deleteInvoice(deleteTarget)
      setDeleteTarget(null)
      fetchInvoices()
    } catch (err) { console.error(err) }
  }

  async function handleViewInvoice(inv) {
    try {
      const full = await api.getInvoice(inv._id)
      setViewInvoice(full)
    } catch {
      setViewInvoice(inv)
    }
    setMenuOpen(null)
  }

  const os = overallStats

  return (
    <div className={styles.page} onClick={() => { setMenuOpen(null); setConfirmPaidPreviewId(null) }}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Invoice</h1>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input type="text" placeholder="Search here..." className={styles.searchInput}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Overall Invoice</h2>
          <div className={styles.overallRow}>
            <div className={styles.overallItem}>
              <p className={styles.overallLabel}>Recent Transactions</p>
              <p className={styles.overallVal}>{os.recentTransactions || 0}</p>
              <p className={styles.overallSub}>Last 7 days</p>
            </div>
            <div className={styles.overallDivider} />
            <div className={styles.overallItem}>
              <p className={styles.overallLabel}>Total Invoices</p>
              <div className={styles.overallRow2}>
                <p className={styles.overallVal}>{os.totalInvoices || 0}</p>
                <p className={styles.overallVal}>{os.processed || 0}</p>
              </div>
              <div className={styles.overallRow2}>
                <p className={styles.overallSub}>Last 7 days</p>
                <p className={styles.overallSub}>Processed</p>
              </div>
            </div>
            <div className={styles.overallDivider} />
            <div className={styles.overallItem}>
              <p className={styles.overallLabel}>Paid Amount</p>
              <div className={styles.overallRow2}>
                <p className={styles.overallVal}>₹{(os.paidAmount || 0).toLocaleString('en-IN')}</p>
                <p className={styles.overallVal}>{os.paidCustomers || 0}</p>
              </div>
              <div className={styles.overallRow2}>
                <p className={styles.overallSub}>Last 7 days</p>
                <p className={styles.overallSub}>customers</p>
              </div>
            </div>
            <div className={styles.overallDivider} />
            <div className={styles.overallItem}>
              <p className={styles.overallLabel}>Unpaid Amount</p>
              <div className={styles.overallRow2}>
                <p className={styles.overallVal}>₹{(os.unpaidAmount || 0).toLocaleString('en-IN')}</p>
                <p className={styles.overallVal}>{os.pendingPayment || 0}</p>
              </div>
              <div className={styles.overallRow2}>
                <p className={styles.overallSub}>Ordered</p>
                <p className={styles.overallSub}>Pending Payment</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Invoices List</h2>
          {loading ? <p style={{ color: '#9ca3af', fontSize: 13, padding: '16px 0' }}>Loading...</p> : (
            <table className={styles.table}>
              <thead><tr>
                <th>Invoice ID</th><th>Reference Number</th><th>Amount (₹)</th>
                <th>Status</th><th>Due Date</th><th></th>
              </tr></thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 24 }}>No invoices yet. Buy products to generate invoices.</td></tr>
                ) : invoices.map(inv => (
                  <tr key={inv._id} className={deleteTarget === inv._id ? styles.deleteRow : ''}>
                    <td>{inv.invoiceId}</td>
                    <td>{inv.referenceNumber}</td>
                    <td>₹ {inv.total.toLocaleString('en-IN')}</td>
                    <td><span className={inv.status === 'Paid' ? styles.paid : styles.unpaid}>{inv.status}</span></td>
                    <td>{new Date(inv.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                    <td className={styles.menuCell} onClick={e => e.stopPropagation()}>
                      <button className={styles.menuBtn} onClick={e => { e.stopPropagation(); openMenu(inv._id) }}><DotsIcon /></button>
                      {menuOpen === inv._id && inv.status === 'Paid' && (
                        <div className={styles.paidMenu} onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            className={styles.paidMenuItem}
                            onClick={() => handleViewInvoice(inv)}
                          >
                            <span className={styles.paidMenuIconView} aria-hidden><MenuEyeIcon /></span>
                            <span>View Invoice</span>
                          </button>
                          <button
                            type="button"
                            className={styles.paidMenuItem}
                            onClick={() => { setDeleteTarget(inv._id); setMenuOpen(null) }}
                          >
                            <span className={styles.paidMenuIconDelete} aria-hidden><MenuTrashIcon /></span>
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                      {menuOpen === inv._id && inv.status !== 'Paid' && (
                        <div
                          className={
                            confirmPaidPreviewId === inv._id
                              ? `${styles.statusPopup} ${styles.statusPopupPaid}`
                              : `${styles.statusPopup} ${styles.statusPopupUnpaid}`
                          }
                          onClick={e => handleStatusPopupClick(inv, e)}
                        >
                          <div
                            className={
                              confirmPaidPreviewId === inv._id
                                ? `${styles.statusIconSquare} ${styles.statusIconSquarePaidTone}`
                                : `${styles.statusIconSquare} ${styles.statusIconSquareUnpaidTone}`
                            }
                          >
                            {confirmPaidPreviewId === inv._id ? (
                              <ReceiptPaidIcon />
                            ) : (
                              <ReceiptUnpaidIcon />
                            )}
                          </div>
                          <span>{confirmPaidPreviewId === inv._id ? 'Paid' : 'Unpaid'}</span>
                        </div>
                      )}
                      {deleteTarget === inv._id && (
                        <div className={styles.deletePopover}>
                          <p>this invoice will be deleted.</p>
                          <div className={styles.deleteActions}>
                            <button className={styles.cancelDelete} onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button className={styles.confirmDelete} onClick={confirmDelete}>Confirm</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span className={styles.pageInfo}>Page {page} of {pages}</span>
            <button className={styles.pageBtn} disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Invoice View Modal */}
      {viewInvoice && (
        <div className={styles.overlay} onClick={() => setViewInvoice(null)}>
          <div className={styles.invoiceModal} onClick={e => e.stopPropagation()}>
            <div className={styles.invoicePaper}>
              <h2 className={styles.invoiceTitle}>INVOICE</h2>
              <div className={styles.invoiceTopRow}>
                <div className={styles.billedTo}>
                  <p className={styles.billedLabel}>Billed to</p>
                  <p className={styles.billedName}>{viewInvoice.billedTo?.name || 'Company Name'}</p>
                  <p className={styles.billedAddr}>{viewInvoice.billedTo?.address || 'Company address'}</p>
                  <p className={styles.billedAddr}>{viewInvoice.billedTo?.city || 'City, Country - 00000'}</p>
                </div>
                <div className={styles.businessAddr}>
                  <p className={styles.billedAddr}>Business address</p>
                  <p className={styles.billedAddr}>City, State, IN - 000 000</p>
                  <p className={styles.billedAddr}>TAX ID 00XXXXX1234GXXX</p>
                </div>
              </div>

              <div className={styles.invoiceBodyGrid}>
                <aside className={styles.invoiceMetaCol}>
                  <div className={styles.metaBlock}>
                    <p className={styles.metaLabel}>Invoice #</p>
                    <p className={styles.metaVal}>{viewInvoice.invoiceId}</p>
                  </div>
                  <div className={styles.metaBlock}>
                    <p className={styles.metaLabel}>Invoice date</p>
                    <p className={styles.metaVal}>{formatInvoiceDate(viewInvoice.createdAt)}</p>
                  </div>
                  <div className={styles.metaBlock}>
                    <p className={styles.metaLabel}>Reference</p>
                    <p className={styles.metaVal}>{viewInvoice.referenceNumber}</p>
                  </div>
                  <div className={styles.metaBlock}>
                    <p className={styles.metaLabel}>Due date</p>
                    <p className={styles.metaVal}>{formatInvoiceDate(viewInvoice.dueDate)}</p>
                  </div>
                </aside>
                <div className={styles.invoiceTableWrap}>
                  <table className={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th>Products</th>
                        <th className={styles.thQty}>Qty</th>
                        <th className={styles.thPrice}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(viewInvoice.items || []).map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
                          <td className={styles.tdQty}>{item.qty}</td>
                          <td className={styles.tdPrice}>₹{formatMoney(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className={styles.totals}>
                    <div className={styles.totalRow}>
                      <span>Subtotal</span>
                      <span>₹{formatMoney(viewInvoice.subtotal)}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Tax (10%)</span>
                      <span>₹{formatMoney(viewInvoice.tax)}</span>
                    </div>
                    <div className={`${styles.totalRow} ${styles.totalDue}`}>
                      <span>Total due</span>
                      <span>₹{formatMoney(viewInvoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className={styles.paymentNote}>
                <span className={styles.noteCheckbox} aria-hidden />
                Please pay within 7 days of receiving this invoice.
              </p>
              <div className={styles.invoiceFooterBar}>
                <span>www.recehtol.inc</span>
                <span>+91 00000 00000</span>
                <span>hello@email.com</span>
              </div>
            </div>
            <div className={styles.invoiceActions}>
              <button type="button" className={styles.closeAction} onClick={() => setViewInvoice(null)} aria-label="Close"><CloseIcon /></button>
              <button type="button" className={styles.downloadAction} onClick={() => window.print()} aria-label="Download"><DownloadIcon /></button>
              <button type="button" className={styles.printAction} onClick={() => window.print()} aria-label="Print"><PrintIcon /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SearchIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function DotsIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg> }
function MenuEyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function MenuTrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}
function CloseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function DownloadIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> }
function PrintIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> }
/** Receipt + check badge (paid), black on cyan squircle */
function ReceiptPaidIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4v16l2-1.5L11 20l2-1.5L15 20l2-1.5L19 20V4H7z" />
      <line x1="10" y1="8" x2="16" y2="8" />
      <line x1="10" y1="12" x2="13" y2="12" />
      <circle cx="16" cy="16" r="5" fill="none" stroke="#000000" />
      <path d="M14.5 16l1 1 2-2" stroke="#000000" />
    </svg>
  )
}

/** Receipt only (unpaid), black on light squircle over red bar */
function ReceiptUnpaidIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4v16l2-1.5L11 20l2-1.5L15 20l2-1.5L19 20V4H7z" />
      <line x1="10" y1="8" x2="16" y2="8" />
      <line x1="10" y1="12" x2="16" y2="12" />
      <line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  )
}
