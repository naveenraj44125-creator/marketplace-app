import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get(`/products/${id}`).then(setProduct).catch(console.error);
  }, [id]);

  const handlePurchase = async () => {
    if (!user) return setMessage({ type: 'error', text: 'Please sign in to purchase' });
    try {
      await api.post('/orders', { productId: id });
      setMessage({ type: 'success', text: 'Purchase successful!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      const newReview = await api.post('/reviews', { productId: id, ...review });
      setProduct({ ...product, reviews: [...(product.reviews || []), newReview] });
      setReview({ rating: 5, comment: '' });
      setMessage({ type: 'success', text: 'Review submitted!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <img src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'} alt={product.name} style={{ width: '100%', borderRadius: 8 }} />
      <div>
        <h1 style={{ marginBottom: 8 }}>{product.name}</h1>
        <p style={{ color: '#666', marginBottom: 8 }}>by {product.sellerName}</p>
        <div style={{ marginBottom: 16 }}>
          <StarRating rating={product.avgRating || 0} />
          <span style={{ marginLeft: 8, color: '#007185' }}>{product.reviewCount || 0} reviews</span>
        </div>
        <p style={{ fontSize: 28, color: '#b12704', marginBottom: 16 }}>${product.price?.toFixed(2)}</p>
        <p style={{ marginBottom: 24, lineHeight: 1.6 }}>{product.description}</p>
        {message.text && <p className={message.type}>{message.text}</p>}
        <button onClick={handlePurchase} className="btn btn-primary" style={{ padding: '14px 40px', fontSize: 16 }}>
          Buy Now
        </button>

        <hr style={{ margin: '32px 0' }} />
        <h3>Customer Reviews</h3>
        {user && (
          <form onSubmit={handleReview} style={{ margin: '16px 0', padding: 16, background: '#f7f7f7', borderRadius: 8 }}>
            <div style={{ marginBottom: 12 }}>
              <label>Your Rating: </label>
              <StarRating rating={review.rating} onRate={(r) => setReview({ ...review, rating: r })} />
            </div>
            <textarea
              placeholder="Write your review..."
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              style={{ width: '100%', padding: 10, marginBottom: 12, minHeight: 80 }}
              required
            />
            <button type="submit" className="btn btn-secondary">Submit Review</button>
          </form>
        )}
        {product.reviews?.length === 0 && <p style={{ color: '#666' }}>No reviews yet</p>}
        {product.reviews?.map((r) => (
          <div key={r.id} style={{ borderBottom: '1px solid #eee', padding: '16px 0' }}>
            <StarRating rating={r.rating} />
            <strong style={{ marginLeft: 8 }}>{r.userName}</strong>
            <p style={{ marginTop: 8 }}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
