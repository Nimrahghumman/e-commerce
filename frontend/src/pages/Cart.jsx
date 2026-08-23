import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Icon from '../components/Icons';

const Cart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
  } = useContext(CartContext);

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Promo Code state
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoFeedback, setPromoFeedback] = useState({ type: '', text: '' });

  const rawSubtotal = getCartTotal();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'SPHERE20' || code === 'SAVE20') {
      const discount = rawSubtotal * 0.2;
      setPromoDiscount(discount);
      setPromoFeedback({ type: 'success', text: 'Coupon "SPHERE20" applied! 20% discount added.' });
    } else if (code === 'SAVE10' || code === 'WELCOME10') {
      const discount = rawSubtotal * 0.1;
      setPromoDiscount(discount);
      setPromoFeedback({ type: 'success', text: 'Coupon "SAVE10" applied! 10% discount added.' });
    } else {
      setPromoDiscount(0);
      setPromoFeedback({ type: 'error', text: 'Invalid promo code. Try "SPHERE20" for 20% OFF!' });
    }
  };

  const finalTotal = Math.max(0, rawSubtotal - promoDiscount);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container page-wrapper">
        <div className="empty-state-box">
          <div className="empty-state-icon">
            <Icon name="cart" size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            Your Shopping Cart is Empty
          </h2>
          <p style={{ margin: '0.75rem auto 1.75rem auto', color: '#64748b', maxWidth: '420px', lineHeight: '1.6' }}>
            Looks like you haven't added any products to your bag yet. Explore our latest arrivals and hot deals!
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <Icon name="shoppingBag" size={18} /> Start Shopping Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      {/* Checkout Stepper Progress */}
      <div className="checkout-progress">
        <div className="progress-step active">
          <span className="step-number">1</span>
          <span>Shopping Cart</span>
        </div>
        <Icon name="chevronRight" size={16} color="#cbd5e1" />
        <div className="progress-step">
          <span className="step-number">2</span>
          <span>Shipping & Payment</span>
        </div>
        <Icon name="chevronRight" size={16} color="#cbd5e1" />
        <div className="progress-step">
          <span className="step-number">3</span>
          <span>Order Confirmation</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="card-title" style={{ fontSize: '1.75rem' }}>
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="card-subtitle">Review your items before proceeding to checkout</p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your entire cart?')) {
              clearCart();
            }
          }}
          className="btn btn-outline btn-sm"
          style={{ color: '#dc2626', borderColor: '#fecaca' }}
        >
          <Icon name="trash" size={14} /> Clear Cart
        </button>
      </div>

      <div className="cart-grid-layout">
        {/* Left Column: Cart Items List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th style={{ textAlign: 'center' }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const isMaxStock = item.quantity >= item.stock;
                  return (
                    <tr key={item.product}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '64px',
                              height: '64px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0',
                              flexShrink: 0
                            }}
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
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                display: 'block',
                                lineHeight: '1.3'
                              }}
                            >
                              {item.name}
                            </Link>
                            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'inline-block', marginTop: '0.25rem' }}>
                              ● In Stock ({item.stock} available)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: '#0f172a' }}>${Number(item.price).toFixed(2)}</strong>
                      </td>
                      <td>
                        <div className="qty-stepper">
                          <button
                            className="qty-step-btn"
                            onClick={() => decreaseQuantity(item.product)}
                            disabled={item.quantity <= 1}
                          >
                            <Icon name="minus" size={13} />
                          </button>
                          <span className="qty-step-value" style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                          <button
                            className="qty-step-btn"
                            onClick={() => increaseQuantity(item.product)}
                            disabled={isMaxStock}
                            title={isMaxStock ? 'Max available stock reached' : 'Increase quantity'}
                          >
                            <Icon name="plus" size={13} />
                          </button>
                        </div>
                        {isMaxStock && (
                          <div style={{ fontSize: '0.7rem', color: '#b91c1c', marginTop: '0.25rem', fontWeight: 600 }}>
                            Max stock reached
                          </div>
                        )}
                      </td>
                      <td>
                        <strong style={{ color: '#4f46e5', fontSize: '1.05rem' }}>
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.5rem', color: '#ef4444' }}
                          title="Remove item"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div>
          <div className="order-summary-box">
            <h2 className="card-title" style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Have a Promo Code?
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="e.g. SPHERE20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="form-input"
                  style={{ textTransform: 'uppercase', fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </div>
              {promoFeedback.text && (
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: '0.4rem',
                  color: promoFeedback.type === 'success' ? '#10b981' : '#ef4444'
                }}>
                  {promoFeedback.text}
                </div>
              )}
            </form>

            <div className="summary-row">
              <span>Items Subtotal</span>
              <span>${rawSubtotal.toFixed(2)}</span>
            </div>

            {promoDiscount > 0 && (
              <div className="summary-row" style={{ color: '#10b981', fontWeight: 600 }}>
                <span>Promo Discount</span>
                <span>-${promoDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Estimated Delivery</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax</span>
              <span>$0.00</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <span style={{ color: '#4f46e5' }}>${finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Proceed to Checkout <Icon name="arrowRight" size={18} />
            </button>

            <Link
              to="/"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              ← Continue Shopping
            </Link>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Icon name="shieldCheck" size={15} color="#10b981" /> 256-Bit Bank-Grade SSL Encryption
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Icon name="refresh" size={15} color="#3b82f6" /> 30-Day Money-Back Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
