import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to retrieve order details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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
    return <div className="loading-center">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="container">
        <div className="card empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2>Order Not Found</h2>
          <p style={{ margin: '1rem 0', color: '#64748b' }}>
            {error || 'Unable to find this order in your account.'}
          </p>
          <Link to="/orders" className="btn btn-primary" style={{ width: 'auto' }}>
            ← Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link
        to="/orders"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex' }}
      >
        ← Back to My Orders
      </Link>

      <div className="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="banner-title">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h1>
          <p className="banner-text">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div>
          <span
            className={`status-badge ${getStatusBadgeClass(order.status)}`}
            style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem' }}
          >
            ● {order.status}
          </span>
        </div>
      </div>

      <div className="checkout-layout">
        {/* Left Column: Ordered Items List */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>
                Ordered Products ({order.orderItems.length})
              </h2>
            </div>

            <div className="table-responsive">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="cart-item-preview">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-item-image"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <Link
                              to={`/products/${item.product}`}
                              style={{
                                textDecoration: 'none',
                                color: '#0f172a',
                                fontWeight: 600,
                              }}
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td><strong>{item.quantity}</strong></td>
                      <td>
                        <strong>
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery & Payment Details */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              📍 Shipping Information
            </h2>
            <div style={{ lineHeight: '1.8', color: '#334155' }}>
              <div><strong>Recipient:</strong> {order.shippingAddress.name}</div>
              <div><strong>Phone:</strong> {order.shippingAddress.phone}</div>
              <div><strong>Address:</strong> {order.shippingAddress.address}</div>
              <div><strong>City:</strong> {order.shippingAddress.city}</div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              💳 Payment Summary
            </h2>
            <div className="summary-row">
              <span>Items Total</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
            </div>
            <div className="summary-row summary-total">
              <span>Grand Total</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
