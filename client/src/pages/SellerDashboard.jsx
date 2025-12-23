import { useState, useEffect } from 'react';
import { api, uploadToS3 } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Other'];

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Electronics' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.role === 'seller') {
      api.get('/products/seller/my-products').then(setProducts);
      api.get('/orders/my-sales').then(setSales);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '', imageKey = '';
      if (file) {
        const upload = await uploadToS3(file);
        imageUrl = upload.imageUrl;
        imageKey = upload.imageKey;
      }
      const product = await api.post('/products', { ...form, imageUrl, imageKey });
      setProducts([...products, product]);
      setForm({ name: '', description: '', price: '', category: 'Electronics' });
      setFile(null);
      setMessage({ type: 'success', text: 'Product added!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    setProducts(products.filter((p) => p.id !== id));
  };

  if (!user || user.role !== 'seller') return <p>Access denied. Seller account required.</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Add Product</h3>
        {message.text && <p className={message.type}>{message.text}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ marginBottom: 16 }}>My Products ({products.length})</h3>
        {products.map((p) => (
          <div key={p.id} className="card" style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <img src={p.imageUrl || 'https://via.placeholder.com/80'} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
            <div style={{ flex: 1 }}>
              <strong>{p.name}</strong>
              <p style={{ color: '#b12704' }}>${p.price.toFixed(2)}</p>
            </div>
            <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#c00' }}>Delete</button>
          </div>
        ))}

        <h3 style={{ margin: '24px 0 16px' }}>Sales ({sales.length})</h3>
        {sales.map((s) => (
          <div key={s.id} className="card" style={{ marginBottom: 12 }}>
            <strong>{s.productName}</strong> - ${s.totalPrice.toFixed(2)}
            <p style={{ fontSize: 12, color: '#666' }}>Buyer: {s.buyerName} | {new Date(s.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
