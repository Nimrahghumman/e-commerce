import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';

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
        setSuccessMessage(`Restocked "${productName}" (+5 units). New Stock: ${currentStock + 5}`);
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
        setSuccessMessage(`Order #${orderId.substring(orderId.length - 8).toUpperCase()} marked as "${newStatus}"`);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchDashboardStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return <div className="loading-center">Aggregating store performance metrics...</div>;
  }

  return (
    <div className="container">
      {/* Banner */}
      <div className="banner admin-banner">
        <h1 className="banner-title">Administrator Analytics & Control Hub</h1>
        <p className="banner-text">
          Store Operations • Performance KPIs • Inventory Alerts • Order Fulfillment
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* 4 KPI Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">👥</div>
          <div className="stat-info">
            <span className="stat-label">Total Registered Users</span>
            <span className="stat-value">{stats?.totalUsers || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">🛍️</div>
          <div className="stat-info">
            <span className="stat-label">Total Store Products</span>
            <span className="stat-value">{stats?.totalProducts || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">📦</div>
          <div className="stat-info">
            <span className="stat-label">Total Customer Orders</span>
            <span className="stat-value">{stats?.totalOrders || 0}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-amber">💵</div>
          <div className="stat-info">
            <span className="stat-label">Total Sales Revenue</span>
            <span className="stat-value">${Number(stats?.totalSales || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="card-title" style={{ margin: 0, fontSize: '1.2rem' }}>Store Management Modules</h2>
          <p className="card-subtitle">Quick jump to catalog control or fulfillment management.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/products" className="btn btn-primary btn-sm">
            📦 Manage Catalog ({stats?.totalProducts || 0} Products)
          </Link>
          <Link to="/admin/orders" className="btn btn-success btn-sm">
            📋 Manage Orders ({stats?.totalOrders || 0} Orders)
          </Link>
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              ⚠️ Low Stock Inventory Alert
            </h2>
            <p className="card-subtitle">
              Products with 5 or fewer units remaining in inventory.
            </p>
          </div>
          {stats?.lowStockCount > 0 ? (
            <span className="stock-badge stock-low">
              {stats.lowStockCount} Products Need Restocking
            </span>
          ) : (
            <span className="stock-badge stock-in">
              Inventory Healthy (All Stock &gt; 5)
            </span>
          )}
        </div>

        {stats?.lowStockProducts?.length === 0 ? (
          <div style={{ padding: '1rem 0', color: '#16a34a', fontWeight: 600 }}>
            ✓ All catalog items have sufficient stock levels!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.lowStockProducts?.map((prod) => {
                  const isZero = prod.stock <= 0;
                  return (
                    <tr key={prod._id}>
                      <td>
                        <div className="cart-item-preview">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="table-thumbnail"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <strong>{prod.name}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="product-category-tag" style={{ margin: 0 }}>
                          {prod.category}
                        </span>
                      </td>
                      <td>${Number(prod.price).toFixed(2)}</td>
                      <td>
                        <strong style={{ color: isZero ? '#dc2626' : '#d97706', fontSize: '1rem' }}>
                          {prod.stock} left
                        </strong>
                      </td>
                      <td>
                        <span className={`stock-badge ${isZero ? 'stock-out' : 'stock-low'}`}>
                          {isZero ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleQuickRestock(prod._id, prod.stock, prod.name)}
                          className="btn btn-secondary btn-sm"
                          title="Add 5 units instantly"
                        >
                          + Restock 5 Units
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

      {/* Recent Orders Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.25rem', margin: 0 }}>
              📦 Recent Customer Transactions
            </h2>
            <p className="card-subtitle">
              Latest 5 customer orders placed in the store.
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            View All ({stats?.totalOrders || 0}) Orders →
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <div style={{ padding: '1rem 0', color: '#64748b' }}>
            No orders placed in the store yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Quick Status Update</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link
                        to={`/orders/${order._id}`}
                        style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
                      >
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </Link>
                    </td>
                    <td>{order.shippingAddress?.name || order.user?.name}</td>
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
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
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
