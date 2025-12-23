import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ background: '#232f3e', padding: '12px 20px', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: 24, fontWeight: 'bold', color: '#f0c14b' }}>Marketplace</Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              {user.role === 'seller' && <Link to="/seller">Seller Dashboard</Link>}
              <Link to="/orders">My Orders</Link>
              <button onClick={logout} className="btn btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
