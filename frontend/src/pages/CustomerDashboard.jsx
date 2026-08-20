import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../api/axiosInstance';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrderCount(res.data.count);
        }
      } catch (err) {
        console.error('Failed to load user order stats:', err);
      }
    };

    fetchOrderStats();
  }, []);

  return (
    <div className="container">
      <div className="banner">
        <h1 className="banner-title">Welcome back, {user?.name}!</h1>
        <p className="banner-text">Customer Portal • Phase 3 Cart & Orders Active</p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="info-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛍️</div>
          <h3>Browse Store</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 1rem 0' }}>
            Explore our latest products and deals.
          </p>
          <Link to="/" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            View Products
          </Link>
        </div>

        <div className="card" style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
          <h3>Shopping Cart</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 1rem 0' }}>
            {getCartCount()} items currently in your cart.
          </p>
          <Link to="/cart" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            Open Cart ({getCartCount()})
          </Link>
        </div>

        <div className="card" style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
          <h3>My Orders</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.5rem 0 1rem 0' }}>
            {orderCount} total orders placed with us.
          </p>
          <Link to="/orders" className="btn btn-success btn-sm" style={{ width: '100%' }}>
            View My Orders ({orderCount})
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Your Profile Details</h2>
        <p className="card-subtitle">
          These details are securely retrieved from your MongoDB user account.
        </p>

        <div className="info-grid">
          <div className="info-box">
            <div className="info-title">Account Holder</div>
            <div className="info-value">{user?.name}</div>
          </div>

          <div className="info-box">
            <div className="info-title">Email Address</div>
            <div className="info-value">{user?.email}</div>
          </div>

          <div className="info-box">
            <div className="info-title">Account Role</div>
            <div className="info-value">
              <span className="user-badge badge-customer">{user?.role}</span>
            </div>
          </div>

          <div className="info-box">
            <div className="info-title">Lifetime Orders</div>
            <div className="info-value">{orderCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
