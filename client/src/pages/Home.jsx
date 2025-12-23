import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Other'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    api.get(`/products?${params}`).then(setProducts).catch(console.error);
  }, [search, category]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 12, border: '1px solid #ddd', borderRadius: 4 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 12, borderRadius: 4 }}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No products found</p>
      ) : (
        <div className="grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
