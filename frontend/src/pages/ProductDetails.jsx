import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icons';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartFeedback, setCartFeedback] = useState({ error: '', success: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          const currentProd = res.data.product;
          setProduct(currentProd);

          // Fetch related products in the same category
          try {
            const relRes = await api.get('/products', {
              params: { category: currentProd.category }
            });
            if (relRes.data.success) {
              setRelatedProducts(
                relRes.data.products.filter((p) => p._id !== currentProd._id).slice(0, 4)
              );
            }
          } catch (relErr) {
            console.error('Failed to load related products:', relErr);
          }
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load product details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
    setQuantity(1);
    setCartFeedback({ error: '', success: '' });
    window.scrollTo(0, 0);
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
    return (
      <div className="container page-wrapper">
        <div className="loading-spinner-container">
          <div className="spinner" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container page-wrapper">
        <div className="empty-state-box">
          <div className="empty-state-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Icon name="alertCircle" size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            Product Not Found
          </h2>
          <p style={{ margin: '0.75rem auto 1.5rem auto', color: '#64748b', maxWidth: '420px' }}>
            {error || "The product you are looking for doesn't exist or has been removed from the catalog."}
          </p>
          <Link to="/" className="btn btn-primary">
            <Icon name="arrowLeft" size={16} /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isFavorited = isInWishlist(product._id);
  const discountRate = product.price > 100 ? 20 : product.price > 40 ? 15 : 10;
  const originalPrice = (product.price * (1 + discountRate / 100)).toFixed(2);
  const savings = (originalPrice - product.price).toFixed(2);

  return (
    <div className="container page-wrapper">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <Icon name="chevronRight" size={14} />
        <Link to={`/?category=${encodeURIComponent(product.category)}`} className="breadcrumb-link" style={{ textTransform: 'capitalize' }}>
          {product.category}
        </Link>
        <Icon name="chevronRight" size={14} />
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="product-detail-layout">
        {/* Left: Product Image Gallery */}
        <div>
          <div className="product-detail-gallery">
            <div className="card-badge-container">
              <span className="badge-discount" style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}>
                SAVE ${savings} ({discountRate}% OFF)
              </span>
            </div>
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-img"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        </div>

        {/* Right: Product Information & Purchase Actions */}
        <div className="product-detail-info">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="product-category-tag" style={{ fontSize: '0.825rem', padding: '0.25rem 0.75rem' }}>
              {product.category}
            </span>
            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: isFavorited ? '#ef4444' : 'inherit' }}
            >
              <Icon name={isFavorited ? "heartFilled" : "heart"} size={16} />
              <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          <h1 className="product-detail-title">{product.name}</h1>

          {/* Ratings & Reviews bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" size={16} />
              ))}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>4.8 / 5.0</span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>(142 verified buyer reviews)</span>
          </div>

          {/* Pricing Box */}
          <div className="product-detail-price-box">
            <span className="detail-price-current">${Number(product.price).toFixed(2)}</span>
            <span className="detail-price-old">${originalPrice}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
              Save ${savings}
            </span>
          </div>

          {/* Stock Availability */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              className={`status-pill ${isOutOfStock ? 'status-cancelled' : product.stock <= 5 ? 'status-pending' : 'status-delivered'}`}
              style={{ fontSize: '0.825rem', padding: '0.35rem 0.85rem' }}
            >
              ● {isOutOfStock ? 'Currently Out of Stock' : `In Stock (${product.stock} units available for instant dispatch)`}
            </span>
          </div>

          {/* Short Description */}
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
            {product.description}
          </p>

          {/* Trust Highlights */}
          <div className="product-perks">
            <div className="perk-item">
              <Icon name="truck" size={18} color="#4f46e5" />
              <span>Free 2-Day Delivery</span>
            </div>
            <div className="perk-item">
              <Icon name="shieldCheck" size={18} color="#10b981" />
              <span>1-Year Official Warranty</span>
            </div>
            <div className="perk-item">
              <Icon name="refresh" size={18} color="#0ea5e9" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
            <div className="perk-item">
              <Icon name="lock" size={18} color="#8b5cf6" />
              <span>100% Secure Checkout</span>
            </div>
          </div>

          {/* Cart Feedback Notification */}
          {cartFeedback.success && (
            <div className="alert alert-success">
              <Icon name="checkCircle" size={18} /> {cartFeedback.success}
            </div>
          )}
          {cartFeedback.error && (
            <div className="alert alert-error">
              <Icon name="alertCircle" size={18} /> {cartFeedback.error}
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  Select Quantity:
                </span>
                <div className="qty-stepper">
                  <button
                    className="qty-step-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="qty-step-value">{quantity}</span>
                  <button
                    className="qty-step-btn"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  (Max: {product.stock})
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn btn-primary btn-lg"
                style={{ flex: 2, minWidth: '180px' }}
              >
                <Icon name="cart" size={18} />
                {isOutOfStock ? 'Sold Out' : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
              </button>

              <Link
                to="/cart"
                className="btn btn-secondary btn-lg"
                style={{ flex: 1, minWidth: '130px' }}
              >
                Go to Cart →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Delivery, Reviews */}
      <div className="card" style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`filter-pill-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            Product Overview & Features
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`filter-pill-btn ${activeTab === 'shipping' ? 'active' : ''}`}
          >
            Shipping & Return Policy
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`filter-pill-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          >
            Customer Reviews (142)
          </button>
        </div>

        {activeTab === 'overview' && (
          <div style={{ lineHeight: '1.7', color: '#334155' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              About this item
            </h3>
            <p style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>{product.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px' }}>
              <div><strong>Category:</strong> {product.category}</div>
              <div><strong>Item Stock:</strong> {product.stock} units</div>
              <div><strong>Warranty:</strong> 1 Year Manufacturer</div>
              <div><strong>SKU:</strong> SPHERE-{product._id.substring(0, 6).toUpperCase()}</div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div style={{ lineHeight: '1.7', color: '#334155' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
              Fast Worldwide Shipping
            </h3>
            <p>
              We process and dispatch all orders within 24 hours on business days. Standard shipping takes 2-4 business days, and expedited priority shipping is available.
            </p>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '1.25rem 0 0.5rem 0' }}>
              30-Day Money Back Guarantee
            </h3>
            <p>
              If you are not completely satisfied with your purchase, you may return the item within 30 days of delivery in its original packaging for a full refund.
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>4.8</div>
              <div>
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" size={18} />
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Based on 142 verified buyer ratings</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong>Michael B.</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>2 days ago</span>
                </div>
                <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.5rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" size={14} />
                  ))}
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                  "Phenomenal product! Build quality is top-notch and exactly as advertised. Fast delivery too."
                </p>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <strong>Jessica W.</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>1 week ago</span>
                </div>
                <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '0.5rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" size={14} />
                  ))}
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                  "Great experience from ordering to delivery. The item works flawlessly."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Similar Products You May Like</h2>
              <p className="section-subtitle">More popular items in the {product.category} collection</p>
            </div>
          </div>

          <div className="products-grid">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
