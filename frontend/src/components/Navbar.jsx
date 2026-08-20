import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = getCartCount();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span>🛒</span>
        <span>ShopEase MERN</span>
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            Products
          </Link>
        </li>

        <li>
          <Link to="/cart" className="nav-link">
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="nav-cart-badge">{cartCount}</span>
            )}
          </Link>
        </li>

        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
          </>
        ) : (
          <>
            {!isAdmin && (
              <>
                <li>
                  <Link to="/orders" className="nav-link">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
              </>
            )}

            {isAdmin && (
              <>
                <li>
                  <Link to="/admin/orders" className="nav-link">
                    Manage Orders
                  </Link>
                </li>
                <li>
                  <Link to="/admin/products" className="nav-link">
                    Manage Products
                  </Link>
                </li>
                <li>
                  <Link to="/admin/dashboard" className="nav-link">
                    Admin Hub
                  </Link>
                </li>
              </>
            )}

            <li>
              <span
                className={`user-badge ${
                  isAdmin ? 'badge-admin' : 'badge-customer'
                }`}
              >
                {user?.role}
              </span>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                Logout ({user?.name})
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
