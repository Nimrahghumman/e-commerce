import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icons';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & About */}
          <div>
            <Link to="/" className="nav-brand" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="brand-icon-box">
                <Icon name="shoppingBag" size={20} />
              </div>
              <span className="brand-title" style={{ color: '#ffffff' }}>
                Shop<span>Sphere</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Your premium destination for handpicked electronics, trendsetting apparel, home essentials, and lifestyle innovations. High quality, guaranteed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div className="feature-box" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <Icon name="shieldCheck" size={16} color="#10b981" />
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>100% Authentic Products</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Explore Store</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Featured Catalog</Link>
              </li>
              <li>
                <Link to="/" className="footer-link">New Arrivals</Link>
              </li>
              <li>
                <Link to="/" className="footer-link">Special Discounts</Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">Shopping Cart</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="footer-title">Customer Service</h4>
            <ul className="footer-links">
              <li>
                <Link to="/orders" className="footer-link">Track Orders</Link>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">User Dashboard</Link>
              </li>
              <li>
                <span className="footer-link" style={{ cursor: 'default' }}>Free Shipping & Returns</span>
              </li>
              <li>
                <span className="footer-link" style={{ cursor: 'default' }}>24/7 VIP Support</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="footer-title">Stay in the Loop</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: '1.5' }}>
              Subscribe to get special discounts, VIP early access, and weekly deals.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                Subscribe & Save 15%
              </button>
            </form>
            {subscribed && (
              <div style={{ marginTop: '0.5rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                ✓ Thank you for subscribing! Discount code sent to your inbox.
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom / Payment Bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} ShopSphere E-Commerce. All rights reserved. Powered by MERN Stack.
          </div>
          <div className="payment-badges">
            <span className="payment-chip">VISA</span>
            <span className="payment-chip">MasterCard</span>
            <span className="payment-chip">PayPal</span>
            <span className="payment-chip">Apple Pay</span>
            <span className="payment-chip">SSL 256-Bit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
