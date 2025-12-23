import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="card" style={{ textDecoration: 'none' }}>
      <img
        src={product.imageUrl || 'https://via.placeholder.com/250x200?text=No+Image'}
        alt={product.name}
        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 4 }}
      />
      <h3 style={{ margin: '12px 0 8px', fontSize: 16 }}>{product.name}</h3>
      <StarRating rating={product.avgRating || 0} />
      <span style={{ fontSize: 12, color: '#666' }}> ({product.reviewCount || 0})</span>
      <p style={{ fontSize: 20, fontWeight: 'bold', color: '#b12704', marginTop: 8 }}>
        ${product.price?.toFixed(2)}
      </p>
      <p style={{ fontSize: 12, color: '#666' }}>by {product.sellerName}</p>
    </Link>
  );
}
