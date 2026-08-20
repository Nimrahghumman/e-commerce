import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load customer orders'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setError('');
      setSuccess('');

      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        setSuccess(`Order #${orderId.substring(orderId.length - 8).toUpperCase()} updated to "${newStatus}"`);
        // Update order in state
        setOrders(
          orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update order status'
      );
    } finally {
      setUpdatingId(null);
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress.name.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">
      {/* Header Banner */}
      <div className="banner admin-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="banner-title">Customer Orders Management</h1>
            <p className="banner-text">
              View all store transactions, update fulfillment statuses, and manage deliveries
            </p>
          </div>
          <Link to="/admin/dashboard" className="btn btn-secondary btn-sm">
            ← Admin Dashboard
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filter and Search Toolbar */}
      <div className="filter-toolbar">
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search by Order ID, Customer Name, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {(search || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="loading-center">Loading orders database...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📋</div>
          <h2>No Orders Found</h2>
          <p style={{ margin: '1rem 0', color: '#64748b' }}>
            {search || statusFilter !== 'all'
              ? 'No orders matched your search or status criteria.'
              : 'No customer orders have been placed yet.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <code style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700 }}>
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </code>
                    </td>
                    <td>
                      <div>
                        <strong>{order.shippingAddress.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {order.user?.email || order.shippingAddress.phone}
                      </div>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span title={order.orderItems.map((i) => `${i.name} (x${i.quantity})`).join(', ')}>
                        <strong>{order.orderItems.reduce((acc, i) => acc + i.quantity, 0)}</strong> items
                      </span>
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
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <Link
                        to={`/orders/${order._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
