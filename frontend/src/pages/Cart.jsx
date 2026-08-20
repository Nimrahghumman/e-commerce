import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

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

  const subtotal = getCartTotal();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="card empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p style={{ margin: '1rem 0', color: '#64748b' }}>
            Looks like you haven't added any products to your shopping cart yet.
          </p>
          <Link to="/" className="btn btn-primary" style={{ width: 'auto' }}>
            Browse Catalog Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="card-title" style={{ margin: 0 }}>
          Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          className="btn btn-secondary btn-sm"
          style={{ color: '#ef4444' }}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        {/* Left Column: Cart Items Table */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const isMaxStock = item.quantity >= item.stock;
                  return (
                    <tr key={item.product}>
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
                                fontSize: '0.95rem',
                              }}
                            >
                              {item.name}
                            </Link>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                              In Stock: {item.stock}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>${Number(item.price).toFixed(2)}</strong>
                      </td>
                      <td>
                        <div className="qty-control">
                          <button
                            className="qty-btn"
                            onClick={() => decreaseQuantity(item.product)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => increaseQuantity(item.product)}
                            disabled={isMaxStock}
                            title={isMaxStock ? 'Reached maximum stock' : 'Increase quantity'}
                          >
                            +
                          </button>
                        </div>
                        {isMaxStock && (
                          <div style={{ fontSize: '0.7rem', color: '#b91c1c', marginTop: '0.25rem' }}>
                            Max stock reached
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          title="Remove item"
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div>
          <div className="cart-summary-box">
            <h2 className="card-title" style={{ fontSize: '1.25rem' }}>
              Order Summary
            </h2>

            <div className="summary-row" style={{ marginTop: '1.25rem' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem' }}
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
