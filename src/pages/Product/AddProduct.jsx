import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import styles from './AddProduct.module.css'

function AddProduct() {
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    productId: '', name: '', category: '', price: '', quantity: '', unit: '', expiryDate: '', thresholdValue: '',
  })

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)) }
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)) }
  }

  function set(field) { return e => setForm(p => ({ ...p, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.productId || !form.name || !form.category || !form.price || !form.quantity || !form.unit) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)
      await api.createProduct(fd)
      navigate('/product')
    } catch (err) {
      setError(err.message || 'Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { label: 'Product Name', key: 'name', placeholder: 'Enter product name' },
    { label: 'Product ID', key: 'productId', placeholder: 'Enter product ID' },
    { label: 'Category', key: 'category', placeholder: 'Select product category' },
    { label: 'Price', key: 'price', placeholder: 'Enter price', type: 'number' },
    { label: 'Quantity', key: 'quantity', placeholder: 'Enter product quantity', type: 'number' },
    { label: 'Unit', key: 'unit', placeholder: 'Enter product unit (kg, pcs, L...)' },
    { label: 'Expiry Date', key: 'expiryDate', placeholder: 'DD/MM/YY' },
    { label: 'Threshold Value', key: 'thresholdValue', placeholder: 'Enter threshold value', type: 'number' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1 className={styles.pageTitle}>Product</h1></div>
      <div className={styles.content}>
        <div className={styles.breadcrumb}>
          <Link to="/product" className={styles.breadLink}>Add Product</Link>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>Individual Product</span>
        </div>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>New Product</h2>
          <div className={styles.imageSection}>
            <label className={styles.imageUpload} onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
              {previewUrl ? <img src={previewUrl} alt="preview" className={styles.imagePreview} />
                : <span className={styles.imagePlaceholder} />}
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
            <div className={styles.imageHint}>
              <p>Drag image here</p><p>or</p>
              <span className={styles.browseLink}>Browse image</span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.fields}>
              {fields.map(f => (
                <div key={f.key} className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>{f.label}</label>
                  <input type={f.type || 'text'} placeholder={f.placeholder}
                    className={styles.fieldInput} value={form[f.key]} onChange={set(f.key)} />
                </div>
              ))}
            </div>
            {error && <p style={{ color: '#dc2626', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}
            <div className={styles.formActions}>
              <button type="button" className={styles.discardBtn} onClick={() => navigate('/product')}>Discard</button>
              <button type="submit" className={styles.addBtn} disabled={loading}>
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default AddProduct
