import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [addedMessage, setAddedMessage] = useState('');
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    const res = addToCart(product, 1);
    setAddedMessage(res.message);
    setTimeout(() => {
      setAddedMessage('');
    }, 2000);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      <div className="product-card-body">
        <span className="product-category-tag">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc-snippet">{product.description}</p>

        <div className="product-card-footer">
          <div>
            <div className="product-price">${Number(product.price).toFixed(2)}</div>
            <span
              className={`stock-badge ${
                isOutOfStock ? 'stock-out' : 'stock-in'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock})`}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link
              to={`/products/${product._id}`}
              className="btn btn-secondary btn-sm"
            >
              Details
            </Link>
            <button
              onClick={handleAddToCart}
              className="btn btn-primary btn-sm"
              disabled={isOutOfStock}
            >
              + Cart
            </button>
          </div>
        </div>

        {addedMessage && (
          <div
            style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: '#166534',
              backgroundColor: '#f0fdf4',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              textAlign: 'center',
            }}
          >
            {addedMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
