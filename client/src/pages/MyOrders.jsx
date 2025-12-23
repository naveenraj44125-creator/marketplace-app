import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) api.get('/orders/my-orders').then(setOrders).catch(console.error);
  }, [user]);

  if (!user) return <p>Please sign in to view your orders</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>My Orders</h2>
      {orders.length === 0 ? (
        <p className="card">No orders yet. <Link to="/" style={{ color: '#007185' }}>Start shopping!</Link></p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card" style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <img src={order.productImage || 'https://via.placeholder.com/100'} alt="" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />
            <div style={{ flex: 1 }}>
              <Link to={`/product/${order.productId}`} style={{ fontSize: 18, color: '#007185' }}>{order.productName}</Link>
              <p style={{ color: '#666', marginTop: 4 }}>Quantity: {order.quantity}</p>
              <p style={{ fontWeight: 'bold', color: '#b12704' }}>${order.totalPrice.toFixed(2)}</p>
              <p style={{ fontSize: 12, color: '#666' }}>Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span style={{ color: '#007600', fontWeight: 500 }}>✓ {order.status}</span>
          </div>
        ))
      )}
    </div>
  );
}
