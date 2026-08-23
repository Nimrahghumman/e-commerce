import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import Icon from './Icons';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  
  const [addedMessage, setAddedMessage] = useState('');
  const isOutOfStock = product.stock <= 0;
  const isFavorited = isInWishlist(product._id);

  // Deterministic calculation for discount display based on ID
  const discountRate = product.price > 100 ? 20 : product.price > 40 ? 15 : 10;
  const originalPrice = (product.price * (1 + discountRate / 100)).toFixed(2);
  
  // Rating score (simulated between 4.4 and 4.9 based on ID length)
  const ratingScore = ((product._id ? product._id.charCodeAt(product._id.length - 1) % 6 : 4) / 10 + 4.4).toFixed(1);
  const reviewCount = (product._id ? (product._id.charCodeAt(0) * 3) % 80 + 18 : 36);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addToCart(product, 1);
    setAddedMessage(res.message);
    setTimeout(() => {
      setAddedMessage('');
    }, 2200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <div className="product-image-container">
        {/* Floating Badges */}
        <div className="card-badge-container">
          <span className="badge-discount">-{discountRate}% OFF</span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="badge-hot" style={{ background: '#d97706' }}>
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`wishlist-float-btn ${isFavorited ? 'active' : ''}`}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Icon name={isFavorited ? 'heartFilled' : 'heart'} size={18} />
        </button>

        {/* Product Image Link */}
        <Link to={`/products/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.image}
            alt={product.name}
            className="product-img"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </Link>
      </div>

      {/* Product Details Body */}
      <div className="product-card-body">
        <div className="product-meta-row">
          <span className="product-category-tag">{product.category}</span>
          <div className="product-rating">
            <Icon name="star" size={13} color="#f59e0b" />
            <span>{ratingScore}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>({reviewCount})</span>
          </div>
        </div>

        <Link to={`/products/${product._id}`} className="product-name-link">
          {product.name}
        </Link>

        <p className="product-desc-snippet">{product.description}</p>

        {/* Footer with Price & Actions */}
        <div className="product-card-footer">
          <div className="price-container">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span className="price-current">${Number(product.price).toFixed(2)}</span>
              <span className="price-old">${originalPrice}</span>
            </div>
            <span className={`stock-indicator ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              ● {isOutOfStock ? 'Sold Out' : `In Stock (${product.stock})`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <Link
              to={`/products/${product._id}`}
              className="btn btn-secondary btn-sm"
              title="View Details"
            >
              <Icon name="eye" size={15} />
            </Link>

            <button
              onClick={handleAddToCart}
              className="btn-add-cart"
              disabled={isOutOfStock}
              title={isOutOfStock ? 'Out of stock' : 'Add to Shopping Cart'}
            >
              <Icon name="cart" size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {addedMessage && (
          <div className="add-success-pill">
            ✓ {addedMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
