import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import Icon from '../components/Icons';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load admin statistics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Quick Restock action for low stock products (+5 units)
  const handleQuickRestock = async (productId, currentStock, productName) => {
    try {
      const res = await api.put(`/products/${productId}`, {
        stock: currentStock + 5,
      });

      if (res.data.success) {
        setSuccessMessage(`✓ Restocked "${productName}" (+5 units). New Stock: ${currentStock + 5}`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchDashboardStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restock product');
    }
  };

  // Quick status updater for recent orders
  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        setSuccessMessage(`✓ Order #${orderId.substring(orderId.length - 8).toUpperCase()} updated to "${newStatus}"`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchDashboardStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
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

  if (loading) {
    return (
      <div className="container page-wrapper">
        <div className="loading-spinner-container">
          <div className="spinner" />
          <p>Aggregating store performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      {/* Executive Admin Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%)',
          color: '#ffffff',
          padding: '2.25rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span className="status-pill status-cancelled" style={{ background: '#fee2e2', color: '#991b1b', fontWeight: 800 }}>
                ADMINISTRATOR PANEL
              </span>
              <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                Store ID: SPHERE-MERN-PROD
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
              Store Operations & Analytics Hub
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Welcome back, {user?.name}. Monitor real-time sales, fulfill customer orders, and adjust catalog inventory.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/products" className="btn btn-primary btn-sm">
              <Icon name="tag" size={15} /> Catalog Manager
            </Link>
            <Link to="/admin/orders" className="btn btn-success btn-sm">
              <Icon name="package" size={15} /> Order Management
            </Link>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error"><Icon name="alertCircle" size={18} /> {error}</div>}
      {successMessage && <div className="alert alert-success"><Icon name="checkCircle" size={18} /> {successMessage}</div>}

      {/* 4 KPI Analytics Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-blue">
            <Icon name="users" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Registered Users
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {stats?.totalUsers || 0}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-green">
            <Icon name="shoppingBag" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Catalog Products
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {stats?.totalProducts || 0}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-purple">
            <Icon name="package" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Orders
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              {stats?.totalOrders || 0}
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon icon-amber">
            <Icon name="dollar" size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Sales Volume
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              ${Number(stats?.totalSales || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="card" style={{ marginBottom: '2rem', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚠️ Low Stock Inventory Warnings</span>
            </h2>
            <p className="card-subtitle">
              Products with 5 or fewer items remaining in stock
            </p>
          </div>

          {stats?.lowStockCount > 0 ? (
            <span className="status-pill status-pending" style={{ fontWeight: 700 }}>
              {stats.lowStockCount} Products Need Restocking
            </span>
          ) : (
            <span className="status-pill status-delivered">
              ✓ All Stock Levels Healthy
            </span>
          )}
        </div>

        {stats?.lowStockProducts?.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>
            <Icon name="checkCircle" size={24} color="#10b981" />
            <div style={{ marginTop: '0.5rem' }}>All catalog items currently have healthy inventory levels (&gt; 5 units).</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Current Stock</th>
                  <th>Inventory Status</th>
                  <th>1-Click Restock</th>
                </tr>
              </thead>
              <tbody>
                {stats?.lowStockProducts?.map((prod) => {
                  const isZero = prod.stock <= 0;
                  return (
                    <tr key={prod._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0'
                            }}
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{prod.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="product-category-tag" style={{ margin: 0 }}>
                          {prod.category}
                        </span>
                      </td>
                      <td>${Number(prod.price).toFixed(2)}</td>
                      <td>
                        <strong style={{ color: isZero ? '#dc2626' : '#d97706', fontSize: '0.95rem' }}>
                          {prod.stock} left
                        </strong>
                      </td>
                      <td>
                        <span className={`status-pill ${isZero ? 'status-cancelled' : 'status-pending'}`}>
                          {isZero ? 'Out of Stock' : 'Low Stock Alert'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleQuickRestock(prod._id, prod.stock, prod.name)}
                          className="btn btn-secondary btn-sm"
                          title="Instantly add 5 units to stock"
                        >
                          <Icon name="plus" size={13} /> Restock 5 Units
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Customer Orders Section */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              📦 Recent Store Transactions
            </h2>
            <p className="card-subtitle">
              Latest 5 customer orders placed across all categories
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            View All ({stats?.totalOrders || 0}) Orders →
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
            No customer orders placed in the store yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Instant Status Change</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
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
                      <strong>{order.shippingAddress?.name || order.user?.name}</strong>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
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
                      <select
                        className="form-select"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto', borderRadius: '6px' }}
                        value={order.status}
                        onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
