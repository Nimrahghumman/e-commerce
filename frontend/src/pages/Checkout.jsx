import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-fill recipient name from logged-in user profile
  useEffect(() => {
    if (user?.name) {
      setShippingAddress((prev) => ({
        ...prev,
        name: user.name,
      }));
    }
  }, [user]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cartItems, navigate, success]);

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, phone, address, city } = shippingAddress;

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      return setError('Please fill in all shipping details: Name, Phone, Address, and City.');
    }

    if (cartItems.length === 0) {
      return setError('Your cart is empty. Please add items before placing an order.');
    }

    try {
      setLoading(true);

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name,
          phone,
          address,
          city,
        },
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        setSuccess('Order placed successfully! Redirecting to order summary...');
        clearCart(); // Empty cart on successful order
        setTimeout(() => {
          navigate(`/orders/${res.data.order._id}`);
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = getCartTotal();

  return (
    <div className="container">
      <div className="banner">
        <h1 className="banner-title">Checkout & Shipping</h1>
        <p className="banner-text">
          Review your items and enter delivery details to finalize your order
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="checkout-layout">
        {/* Left Column: Shipping Form */}
        <div className="card">
          <h2 className="card-title" style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>
            🚚 Delivery Address
          </h2>

          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Receiver's full name"
                value={shippingAddress.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="e.g. +1 555-0199 or 03001234567"
                value={shippingAddress.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-input"
                placeholder="House / Apartment #, Street name"
                value={shippingAddress.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="city">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="form-input"
                placeholder="e.g. New York, London, Karachi"
                value={shippingAddress.city}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || cartItems.length === 0}
              style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
            >
              {loading ? 'Processing Order...' : `Place Order ($${totalAmount.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Review */}
        <div>
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Order Items ({cartItems.length})
            </h2>

            <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '1rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid #f1f5f9',
                    gap: '0.75rem',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '0.375rem',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Qty: {item.quantity} &times; ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total to Pay</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/cart" style={{ color: '#2563eb', fontSize: '0.85rem', textDecoration: 'none' }}>
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
