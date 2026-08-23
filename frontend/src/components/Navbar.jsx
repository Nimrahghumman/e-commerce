import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import Icon from './Icons';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const { getWishlistCount } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/');
    }
  };

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <header className="navbar-wrapper">
      {/* Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="announcement-text">
          <span className="announcement-badge">LIMITED DEAL</span>
          <span>🔥 Flash Sale: Get 20% OFF your entire order with code <strong>SPHERE20</strong> • Free Worldwide Delivery over $50</span>
        </div>
        <div className="announcement-support">
          <span>📞 Support: +1 (800) 555-0199</span>
          <span>⚡ Fast 2-Day Delivery</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar-main">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <Icon name="shoppingBag" size={22} />
          </div>
          <span className="brand-title">
            Shop<span>Sphere</span>
          </span>
        </Link>

        {/* Global Live Search Bar */}
        <form className="nav-search-bar" onSubmit={handleSearchSubmit}>
          <div className="nav-search-input-wrap">
            <span className="nav-search-icon">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search products, brands, categories..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
            {navSearch && (
              <button
                type="button"
                className="nav-search-clear"
                onClick={() => {
                  setNavSearch('');
                  navigate('/');
                }}
              >
                <Icon name="x" size={14} />
              </button>
            )}
          </div>
        </form>

        {/* Right Navigation Actions */}
        <div className="nav-actions">
          {/* Wishlist Link */}
          <Link
            to={isAuthenticated ? "/dashboard?tab=wishlist" : "/"}
            className="nav-action-btn"
            title="Saved Wishlist"
          >
            <Icon name="heart" size={20} />
            {wishlistCount > 0 && (
              <span className="nav-badge-count accent">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart Link with Badge */}
          <Link to="/cart" className="nav-action-btn" title="View Cart">
            <Icon name="cart" size={20} />
            <span style={{ fontSize: '0.85rem' }}>Cart</span>
            {cartCount > 0 && (
              <span className="nav-badge-count">{cartCount}</span>
            )}
          </Link>

          {/* Auth State Menu */}
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join Free
              </Link>
            </div>
          ) : (
            <div className="nav-user-menu">
              <div className="user-avatar-btn">
                <div className="avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1.2' }}>
                  <span className="user-name-label">{user?.name}</span>
                  <span style={{ fontSize: '0.65rem', color: isAdmin ? '#dc2626' : '#4f46e5', fontWeight: 700 }}>
                    {isAdmin ? 'ADMIN' : 'MEMBER'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.5rem', marginLeft: '0.35rem', fontSize: '0.75rem' }}
                  title="Logout"
                >
                  <Icon name="logout" size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Categories Bar */}
      <nav className="navbar-sub">
        <ul className="nav-categories-list">
          <li>
            <Link
              to="/"
              className={`nav-sub-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Icon name="grid" size={14} />
              All Products
            </Link>
          </li>

          {!isAdmin && isAuthenticated && (
            <>
              <li>
                <Link
                  to="/orders"
                  className={`nav-sub-link ${location.pathname === '/orders' ? 'active' : ''}`}
                >
                  <Icon name="package" size={14} />
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className={`nav-sub-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <Icon name="dashboard" size={14} />
                  My Account
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <>
              <li>
                <Link
                  to="/admin/dashboard"
                  className={`nav-sub-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                >
                  <Icon name="dashboard" size={14} />
                  Analytics Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className={`nav-sub-link ${location.pathname === '/admin/products' ? 'active' : ''}`}
                >
                  <Icon name="tag" size={14} />
                  Catalog Inventory
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className={`nav-sub-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}
                >
                  <Icon name="package" size={14} />
                  Order Fulfillment
                </Link>
              </li>
            </>
          )}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Icon name="shieldCheck" size={14} color="#10b981" /> 100% Safe Checkout
          </span>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="nav-brand">
            <div className="brand-icon-box">
              <Icon name="shoppingBag" size={20} />
            </div>
            <span className="brand-title">Shop<span>Sphere</span></span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} style={{ marginBottom: '1.25rem' }}>
          <div className="nav-search-input-wrap">
            <input
              type="text"
              className="form-input"
              placeholder="Search products..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.85rem' }}
            />
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Link
            to="/"
            className="nav-sub-link"
            style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon name="grid" size={16} /> All Products
          </Link>
          <Link
            to="/cart"
            className="nav-sub-link"
            style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem', justifyContent: 'space-between' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name="cart" size={16} /> Shopping Cart
            </span>
            {cartCount > 0 && <span className="nav-badge-count">{cartCount}</span>}
          </Link>

          {!isAdmin && isAuthenticated && (
            <>
              <Link
                to="/orders"
                className="nav-sub-link"
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="package" size={16} /> My Orders
              </Link>
              <Link
                to="/dashboard"
                className="nav-sub-link"
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="dashboard" size={16} /> Dashboard
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                className="nav-sub-link"
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="dashboard" size={16} /> Admin Hub
              </Link>
              <Link
                to="/admin/products"
                className="nav-sub-link"
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="tag" size={16} /> Manage Catalog
              </Link>
              <Link
                to="/admin/orders"
                className="nav-sub-link"
                style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon name="package" size={16} /> Manage Orders
              </Link>
            </>
          )}
        </div>

        {/* Mobile Auth Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar-circle">{user?.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
                style={{ width: '100%' }}
              >
                <Icon name="logout" size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
