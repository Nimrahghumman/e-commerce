import React, { useContext, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import api from '../api/axiosInstance';
import Icon from '../components/Icons';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { getCartCount, addToCart } = useContext(CartContext);
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistMessage, setWishlistMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load user order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddWishlistToCart = (product) => {
    const res = addToCart(product, 1);
    setWishlistMessage(`✓ "${product.name}" added to your cart!`);
    setTimeout(() => setWishlistMessage(''), 2500);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  return (
    <div className="container page-wrapper">
      {/* Welcome Banner Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        color: '#ffffff',
        padding: '2.25rem',
        borderRadius: '20px',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
                  Welcome, {user?.name}!
                </h1>
                <span className="status-pill status-delivered" style={{ background: '#ecfdf5', color: '#047857' }}>
                  ● Verified Member
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                {user?.email} • Customer Portal
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/" className="btn btn-primary btn-sm">
              <Icon name="shoppingBag" size={15} /> Shop Catalog
            </Link>
            <Link to="/orders" className="btn btn-secondary btn-sm">
              <Icon name="package" size={15} /> All Orders ({orders.length})
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat KPI Widgets */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-purple">
            <Icon name="package" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Lifetime Orders
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {orders.length}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-blue">
            <Icon name="cart" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Cart Items
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {getCartCount()}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-amber">
            <Icon name="heart" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Saved Wishlist
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {wishlistItems.length}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-green">
            <Icon name="shieldCheck" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Account Security
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
              Protected
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`filter-pill-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <Icon name="dashboard" size={14} /> Recent Orders
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`filter-pill-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
        >
          <Icon name="heart" size={14} /> Saved Wishlist ({wishlistItems.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`filter-pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
        >
          <Icon name="user" size={14} /> Profile & Settings
        </button>
      </div>

      {/* Tab 1: Recent Orders */}
      {activeTab === 'overview' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              Recent Orders Overview
            </h2>
            <Link to="/orders" className="btn btn-secondary btn-sm">
              View All Orders →
            </Link>
          </div>

          {loading ? (
            <div className="loading-spinner-container">
              <div className="spinner" />
              <p>Fetching your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <div className="empty-state-icon">
                <Icon name="package" size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>No Orders Placed Yet</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.5rem 0 1.25rem 0' }}>
                Your order history will appear here once you place your first order.
              </p>
              <Link to="/" className="btn btn-primary btn-sm">
                Explore Catalog Products
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order Reference</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link
                          to={`/orders/${order._id}`}
                          style={{ color: '#4f46e5', fontWeight: 700 }}
                        >
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </Link>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} items
                        </span>
                      </td>
                      <td>
                        <strong>${Number(order.totalAmount).toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusBadgeClass(order.status)}`}>
                          ● {order.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/orders/${order._id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Track Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistMessage && (
            <div className="alert alert-success">
              <Icon name="checkCircle" size={18} /> {wishlistMessage}
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-state-icon">
                <Icon name="heart" size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                Your Wishlist is Empty
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.5rem 0 1.25rem 0' }}>
                Click the heart icon on any product in our store to save it to your favorites.
              </p>
              <Link to="/" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {wishlistItems.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-img"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="wishlist-float-btn active"
                      title="Remove from wishlist"
                    >
                      <Icon name="heartFilled" size={18} color="#ef4444" />
                    </button>
                  </div>

                  <div className="product-card-body">
                    <span className="product-category-tag">{product.category}</span>
                    <Link to={`/products/${product._id}`} className="product-name-link">
                      {product.name}
                    </Link>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>
                      ${Number(product.price).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleAddWishlistToCart(product)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', marginTop: 'auto' }}
                      disabled={product.stock <= 0}
                    >
                      <Icon name="cart" size={15} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile & Account Settings */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="card-title" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            Account Profile Details
          </h2>
          <p className="card-subtitle" style={{ marginBottom: '1.5rem' }}>
            Personal credentials and active session info
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Account Name
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                {user?.name}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Email Address
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                {user?.email}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Membership Role
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4f46e5', marginTop: '0.25rem', textTransform: 'uppercase' }}>
                {user?.role}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
