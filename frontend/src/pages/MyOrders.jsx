import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to retrieve your order history'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

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
    return <div className="loading-center">Loading your orders...</div>;
  }

  return (
    <div className="container">
      <div className="banner">
        <h1 className="banner-title">My Order History</h1>
        <p className="banner-text">
          Track real-time status and view details of all your placed orders
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No Orders Found</h2>
          <p style={{ margin: '1rem 0', color: '#64748b' }}>
            You haven't placed any orders yet. Start exploring our product collection!
          </p>
          <Link to="/" className="btn btn-primary" style={{ width: 'auto' }}>
            Shop Now →
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date Placed</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <code style={{ fontSize: '0.85rem', color: '#2563eb' }}>
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </code>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {order.orderItems.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            title={`${item.name} (Qty: ${item.quantity})`}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '4px',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0',
                            }}
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                        ))}
                        {order.orderItems.length > 3 && (
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            +{order.orderItems.length - 3} more
                          </span>
                        )}
                      </div>
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
                      <Link
                        to={`/orders/${order._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View Details →
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

export default MyOrders;
