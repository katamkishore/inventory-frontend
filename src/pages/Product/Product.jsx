import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import styles from './Product.module.css'

const LIMIT = 10

function statusClass(status, s) {
  if (status === 'In stock') return s.inStock
  if (status === 'Out of stock') return s.outStock
  return s.lowStock
}

export default function Product() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvError, setCsvError] = useState('')
  const [csvResult, setCsvResult] = useState(null)
  const [buyProduct, setBuyProduct] = useState(null)
  const [buyQty, setBuyQty] = useState(1)
  const [buyLoading, setBuyLoading] = useState(false)

  const fetchProducts = useCallback(async (overrides = {}) => {
    const p = overrides.page !== undefined ? overrides.page : page
    const s = overrides.search !== undefined ? overrides.search : search
    setLoading(true)
    try {
      const data = await api.getProducts({ page: p, limit: LIMIT, search: s })
      setProducts(data.products || [])
      setTotal(data.total ?? 0)
      setPages(Math.max(1, data.pages ?? 1))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  async function handleBuy(e) {
    e.preventDefault()
    if (buyQty < 1) return
    setBuyLoading(true)
    try {
      await api.buyProduct(buyProduct._id, { quantity: buyQty })
      setBuyProduct(null)
      setBuyQty(1)
      fetchProducts()
    } catch (err) { console.error(err) }
    finally { setBuyLoading(false) }
  }

  async function handleCSVUpload() {
    if (!csvFile) return
    setCsvUploading(true)
    setCsvError('')
    setCsvResult(null)
    try {
      const fd = new FormData()
      fd.append('file', csvFile)
      const result = await api.uploadCSV(fd)
      if (result.created === 0 && result.errors && result.errors.length > 0) {
        setCsvError(`No products created. Errors:\n${result.errors.slice(0, 5).join('\n')}`)
        return
      }
      setCsvResult(result)
      setTimeout(() => {
        setShowCSVModal(false)
        setCsvFile(null)
        setCsvResult(null)
        setSearch('')
        setPage(1)
        fetchProducts({ page: 1, search: '' })
      }, 1500)
    } catch (err) {
      setCsvError(err.message || 'Upload failed. Please try again.')
    } finally {
      setCsvUploading(false)
    }
  }

  // Inventory summary counts
  const inStockCount = products.filter(p => p.status !== 'Out of stock').reduce((s, p) => s + p.quantity, 0)
  const categories = [...new Set(products.map(p => p.category))].length
  const topSelling = products.filter(p => p.salesCount > 0).length
  const lowStock = products.filter(p => p.status === 'Low stock').length
  const outOfStock = products.filter(p => p.status === 'Out of stock').length

  return (
    <div className={styles.page} onClick={() => setShowUploadModal(false)}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Product</h1>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input type="text" placeholder="Search here..." className={styles.searchInput}
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>

      <div className={styles.content}>
        {/* Overall Inventory */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Overall Inventory</h2>
          <div className={styles.inventoryRow}>
            <div className={styles.invItem}>
              <p className={styles.invLabel}>Categories</p>
              <p className={styles.invVal}>{categories}</p>
              <p className={styles.invSub}>Last 7 days</p>
            </div>
            <div className={styles.invDivider} />
            <div className={styles.invItem}>
              <p className={styles.invLabel}>Total Products</p>
              <div className={styles.invRow}><p className={styles.invVal}>{total}</p></div>
              <p className={styles.invSub}>Last 7 days</p>
            </div>
            <div className={styles.invDivider} />
            <div className={styles.invItem}>
              <p className={styles.invLabel}>Top Selling</p>
              <p className={styles.invVal}>{topSelling}</p>
              <p className={styles.invSub}>Last 7 days</p>
            </div>
            <div className={styles.invDivider} />
            <div className={styles.invItem}>
              <p className={styles.invLabel}>Low Stocks</p>
              <div className={styles.invRow}>
                <p className={styles.invVal}>{lowStock}</p>
                <p className={styles.invVal}>{outOfStock}</p>
              </div>
              <div className={styles.invRow}>
                <p className={styles.invSub}>Low Stock</p>
                <p className={styles.invSub}>Not in stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className={styles.card}>
          <div className={styles.tableHeader}>
            <h2 className={styles.cardTitle}>Products</h2>
            <button className={styles.addBtn} onClick={e => { e.stopPropagation(); setShowUploadModal(true) }}>Add Product</button>
          </div>

          {loading ? <p className={styles.loadingText}>Loading products...</p> : (
            <table className={styles.table}>
              <thead><tr>
                <th>Products</th><th>Price</th><th>Quantity</th>
                <th>Threshold Value</th><th>Expiry Date</th><th>Availability</th>
              </tr></thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={6} className={styles.emptyRow}>No products found. Add your first product!</td></tr>
                ) : products.map(p => (
                  <tr key={p._id} onClick={() => { setBuyProduct(p); setBuyQty(1) }} className={styles.clickableRow}>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.quantity} {p.unit}</td>
                    <td>{p.thresholdValue}</td>
                    <td>{p.expiryDate || '-'}</td>
                    <td><span className={statusClass(p.status, styles)}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span className={styles.pageInfo}>
              Page {page} of {pages}
              <span className={styles.pageMeta}>{total} products · {LIMIT} per page</span>
            </span>
            <button className={styles.pageBtn} disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Upload Choice Modal */}
      {showUploadModal && (
        <div className={styles.overlay} onClick={() => setShowUploadModal(false)}>
          <div className={styles.choiceModal} onClick={e => e.stopPropagation()}>
            <button className={styles.choiceBtn} onClick={() => { setShowUploadModal(false); navigate('/product/add') }}>individual product</button>
            <button className={styles.choiceBtn} onClick={() => { setShowUploadModal(false); setShowCSVModal(true) }}>Multiple product</button>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVModal && (
        <div className={styles.overlay} onClick={() => { setShowCSVModal(false); setCsvFile(null); setCsvError(''); setCsvResult(null) }}>
          <div className={styles.csvModal} onClick={e => e.stopPropagation()}>
            <div className={styles.csvModalHeader}>
              <div><h3 className={styles.csvTitle}>CSV Upload</h3><p className={styles.csvSubtitle}>Add your documents here</p></div>
              <button className={styles.closeBtn} onClick={() => { setShowCSVModal(false); setCsvFile(null); setCsvError(''); setCsvResult(null) }}><CloseIcon /></button>
            </div>
            <div className={styles.dropzone} onDrop={e => { e.preventDefault(); if (e.dataTransfer.files[0]) { setCsvFile(e.dataTransfer.files[0]); setCsvError(''); setCsvResult(null) } }} onDragOver={e => e.preventDefault()}>
              <UploadFolderIcon />
              <p className={styles.dropText}>Drag your file(s) to start uploading</p>
              <p className={styles.orText}>OR</p>
              <label className={styles.browseBtn}>Browse files<input type="file" accept=".csv" onChange={e => { if (e.target.files[0]) { setCsvFile(e.target.files[0]); setCsvError(''); setCsvResult(null) } }} hidden /></label>
            </div>
            {csvFile && (
              <div className={styles.filePreview}>
                <CsvFileIcon />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{csvFile.name}</span>
                </div>
                <button className={styles.removeFile} onClick={() => { setCsvFile(null); setCsvError(''); setCsvResult(null) }}><CloseCircleIcon /></button>
              </div>
            )}
            {csvError && (
              <div className={styles.csvError}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{csvError}</pre>
              </div>
            )}
            {csvResult && (
              <div className={styles.csvSuccess}>
                {csvResult.created} product{csvResult.created !== 1 ? 's' : ''} added successfully!
                {csvResult.errors && csvResult.errors.length > 0 && ` (${csvResult.errors.length} row${csvResult.errors.length !== 1 ? 's' : ''} skipped)`}
              </div>
            )}
            <div className={styles.csvActions}>
              <button className={styles.cancelBtn} onClick={() => { setShowCSVModal(false); setCsvFile(null); setCsvError(''); setCsvResult(null) }}>Cancel</button>
              {csvFile
                ? <button className={styles.uploadBtn} onClick={handleCSVUpload} disabled={csvUploading}>{csvUploading ? 'Uploading...' : 'Upload'}</button>
                : <button className={styles.nextBtn}>Next <ChevronIcon /></button>
              }
            </div>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {buyProduct && (
        <div className={styles.overlay} onClick={() => setBuyProduct(null)}>
          <div className={styles.buyModal} onClick={e => e.stopPropagation()}>
            <div className={styles.buyHeader}>
              <h3 className={styles.buyTitle}>Buy Product</h3>
              <button className={styles.closeBtn} onClick={() => setBuyProduct(null)}><CloseIcon /></button>
            </div>
            <p className={styles.buyProductName}>{buyProduct.name}</p>
            <p className={styles.buyStock}>Available: {buyProduct.quantity} {buyProduct.unit}</p>
            <form onSubmit={handleBuy} className={styles.buyForm}>
              <label className={styles.buyLabel}>Quantity</label>
              <input type="number" min={1} max={buyProduct.quantity} value={buyQty}
                onChange={e => setBuyQty(Number(e.target.value))} className={styles.buyInput} />
              <p className={styles.buyTotal}>Total: ₹{(buyProduct.price * buyQty).toLocaleString('en-IN')}</p>
              <button type="submit" className={styles.buyBtn} disabled={buyLoading || buyProduct.quantity === 0}>
                {buyProduct.quantity === 0 ? 'Out of Stock' : buyLoading ? 'Processing...' : 'Buy'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SearchIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> }
function CloseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> }
function CloseCircleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> }
function UploadFolderIcon() { return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><polyline points="9 14 12 11 15 14"/></svg> }
function CsvFileIcon() { return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }
function ChevronIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg> }
