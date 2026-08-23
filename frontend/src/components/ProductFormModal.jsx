import React, { useState, useEffect } from 'react';
import Icon from './Icons';

const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
  });

  const [formError, setFormError] = useState('');

  // Populate form if editing existing product
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        price: initialData.price !== undefined ? initialData.price : '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        image: initialData.image || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        image: '',
        description: '',
      });
    }
    setFormError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, category, price, stock, description } = formData;

    if (!name.trim() || !category.trim() || price === '' || stock === '' || !description.trim()) {
      return setFormError('Please fill in all required fields marked with *');
    }

    if (Number(price) < 0) {
      return setFormError('Price cannot be negative');
    }

    if (Number(stock) < 0) {
      return setFormError('Stock cannot be negative');
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 className="card-title" style={{ fontSize: '1.35rem', margin: 0 }}>
              {initialData ? 'Edit Catalog Product' : 'Add New Store Product'}
            </h2>
            <p className="card-subtitle">
              {initialData ? 'Update pricing, inventory levels, and details' : 'Enter product information to publish to store'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.4rem' }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {formError && <div className="alert alert-error"><Icon name="alertCircle" size={18} /> {formError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Product Title / Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                className="form-input"
                placeholder="e.g. Electronics, Fashion, Shoes"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">
                Price in USD ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="49.99"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="stock">
                Inventory Stock Units *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                className="form-input"
                placeholder="25"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image">
                Image Web URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={handleChange}
              />
              <span className="form-hint">Unsplash or web image URL</span>
            </div>
          </div>

          {/* Live Image Preview if provided */}
          {formData.image && (
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <img
                src={formData.image}
                alt="Preview"
                style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Live Image URL Preview</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Product Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              placeholder="Highlight features, specifications, materials, and warranty information..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving Changes...'
                : initialData
                ? 'Update Product'
                : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
