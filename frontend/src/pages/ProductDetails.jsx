import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartFeedback, setCartFeedback] = useState({ error: '', success: '' });

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load product details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setCartFeedback({ error: '', success: '' });
    const result = addToCart(product, quantity);

    if (result.success) {
      setCartFeedback({ error: '', success: result.message });
    } else {
      setCartFeedback({ error: result.message, success: '' });
    }
  };

  if (loading) {
    return <div className="loading-center">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="card empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h2>Product Not Found</h2>
          <p style={{ margin: '1rem 0', color: '#64748b' }}>
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/" className="btn btn-primary" style={{ width: 'auto' }}>
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container">
      <Link
        to="/"
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex' }}
      >
        ← Back to All Products
      </Link>

      <div className="product-details-container">
        {/* Left Column: Product Image */}
        <div className="product-detail-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Right Column: Product Info & Cart Action */}
        <div className="product-detail-info">
          <span className="product-category-tag">{product.category}</span>
          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-detail-price">
            ${Number(product.price).toFixed(2)}
          </div>

          <div>
            <span
              className={`stock-badge ${
                isOutOfStock ? 'stock-out' : 'stock-in'
              }`}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
            >
              {isOutOfStock
                ? '● Currently Out of Stock'
                : `● In Stock (${product.stock} units available)`}
            </span>
          </div>

          <div className="product-detail-desc">
            <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Description
            </h3>
            <p style={{ whiteSpace: 'pre-line' }}>{product.description}</p>
          </div>

          {/* Cart & Quantity Section */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            {cartFeedback.success && (
              <div className="alert alert-success">{cartFeedback.success}</div>
            )}
            {cartFeedback.error && (
              <div className="alert alert-error">{cartFeedback.error}</div>
            )}

            {!isOutOfStock && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Quantity:
                </label>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Max: {product.stock}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                disabled={isOutOfStock}
                style={{ flex: 2 }}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>

              {cartFeedback.success && (
                <Link to="/cart" className="btn btn-success" style={{ flex: 1 }}>
                  View Cart →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
