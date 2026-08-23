import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';
import Icon from '../components/Icons';

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

  const [paymentMethod, setPaymentMethod] = useState('cod');
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
      return setError('Please fill in all shipping details: Full Name, Phone Number, Address, and City.');
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
        setSuccess('🎉 Order placed successfully! Directing you to your order summary...');
        clearCart();
        setTimeout(() => {
          navigate(`/orders/${res.data.order._id}`);
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to place order. Please check your network and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = getCartTotal();

  return (
    <div className="container page-wrapper">
      {/* Stepper Progress */}
      <div className="checkout-progress">
        <div className="progress-step completed">
          <span className="step-number"><Icon name="check" size={14} /></span>
          <span>Shopping Cart</span>
        </div>
        <Icon name="chevronRight" size={16} color="#4f46e5" />
        <div className="progress-step active">
          <span className="step-number">2</span>
          <span>Shipping & Payment</span>
        </div>
        <Icon name="chevronRight" size={16} color="#cbd5e1" />
        <div className="progress-step">
          <span className="step-number">3</span>
          <span>Order Confirmation</span>
        </div>
      </div>

      {error && <div className="alert alert-error"><Icon name="alertCircle" size={18} /> {error}</div>}
      {success && <div className="alert alert-success"><Icon name="checkCircle" size={18} /> {success}</div>}

      <div className="cart-grid-layout">
        {/* Left Column: Shipping & Payment Details */}
        <div>
          <form onSubmit={handlePlaceOrder}>
            {/* Step 1: Shipping Address */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="mapPin" size={18} />
                </div>
                <div>
                  <h2 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>
                    1. Shipping Information
                  </h2>
                  <p className="card-subtitle">Where should we deliver your package?</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="e.g. Alexander Hamilton"
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
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">
                  Street Address / Apartment *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-input"
                  placeholder="e.g. Flat 4B, Sunset Boulevard 102"
                  value={shippingAddress.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City & Postal Region *
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
            </div>

            {/* Step 2: Payment Method Selector */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="creditCard" size={18} />
                </div>
                <div>
                  <h2 className="card-title" style={{ fontSize: '1.2rem', margin: 0 }}>
                    2. Payment Method
                  </h2>
                  <p className="card-subtitle">Select your preferred transaction option</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '10px',
                    border: `2px solid ${paymentMethod === 'cod' ? '#4f46e5' : '#e2e8f0'}`,
                    background: paymentMethod === 'cod' ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.925rem', color: '#0f172a' }}>
                        Cash on Delivery (COD)
                      </strong>
                      <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                        Pay with cash upon package receipt at your doorstep
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.25rem' }}>💵</span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '10px',
                    border: `2px solid ${paymentMethod === 'card' ? '#4f46e5' : '#e2e8f0'}`,
                    background: paymentMethod === 'card' ? '#eef2ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.925rem', color: '#0f172a' }}>
                        Credit / Debit Card (Online Pay)
                      </strong>
                      <span style={{ fontSize: '0.775rem', color: '#64748b' }}>
                        Visa, MasterCard, Amex, Apple Pay (Simulated Instant Verification)
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.25rem' }}>💳</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading || cartItems.length === 0}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span>Processing Order...</span>
              ) : (
                <span>Confirm & Place Order (${totalAmount.toFixed(2)}) →</span>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Items Review & Final Total */}
        <div>
          <div className="order-summary-box">
            <h2 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
              Order Review ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Scrollable list of items */}
            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.25rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid #f1f5f9',
                    gap: '0.75rem',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Qty: {item.quantity} &times; ${Number(item.price).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Items Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Express Delivery</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
            </div>

            <div className="summary-row summary-total">
              <span>Grand Total</span>
              <span style={{ color: '#4f46e5' }}>${totalAmount.toFixed(2)}</span>
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <Link to="/cart" style={{ color: '#4f46e5', fontSize: '0.85rem', fontWeight: 600 }}>
                ← Edit Shopping Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
