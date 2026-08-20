import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import ProductFormModal from '../components/ProductFormModal';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search in admin table
  const [adminSearch, setAdminSearch] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Failed to load products table'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for Adding
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
    setActionError('');
    setActionSuccess('');
  };

  // Open modal for Editing
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    setActionError('');
    setActionSuccess('');
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Handle Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setActionError('');
    setActionSuccess('');

    try {
      if (editingProduct) {
        // Update product (PUT)
        const res = await api.put(`/products/${editingProduct._id}`, formData);
        if (res.data.success) {
          setActionSuccess(`"${formData.name}" updated successfully!`);
          handleCloseModal();
          fetchProducts();
        }
      } else {
        // Create product (POST)
        const res = await api.post('/products', formData);
        if (res.data.success) {
          setActionSuccess(`"${formData.name}" created successfully!`);
          handleCloseModal();
          fetchProducts();
        }
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Failed to save product. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setActionError('');
    setActionSuccess('');

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        setActionSuccess(`"${name}" deleted successfully.`);
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Failed to delete product.'
      );
    }
  };

  // Quick Inline Stock Update (+1 / -1)
  const handleQuickStockChange = async (product, change) => {
    const newStock = Math.max(0, product.stock + change);
    try {
      const res = await api.put(`/products/${product._id}`, {
        stock: newStock,
      });
      if (res.data.success) {
        setProducts(
          products.map((p) =>
            p._id === product._id ? { ...p, stock: newStock } : p
          )
        );
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Failed to update stock quantity'
      );
    }
  };

  // Filter products for admin search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="container">
      {/* Header Banner */}
      <div className="banner admin-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="banner-title">Admin Product Management</h1>
            <p className="banner-text">
              Create, edit, delete catalog products, and adjust inventory stock
            </p>
          </div>
          <button onClick={handleOpenAddModal} className="btn btn-success">
            + Add New Product
          </button>
        </div>
      </div>

      {/* Alerts */}
      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {actionError && <div className="alert alert-error">{actionError}</div>}

      {/* Toolbar / Search */}
      <div className="filter-toolbar">
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="Search within management table..."
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
          />
        </div>
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Total Products: <strong>{products.length}</strong>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="loading-center">Loading product inventory...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>No Products Found</h2>
          <p style={{ margin: '1rem 0', color: '#64748b' }}>
            {adminSearch
              ? 'No products match your search keyword.'
              : 'Your store has no products yet. Click the button below to add your first product!'}
          </p>
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ width: 'auto' }}>
            + Add Product Now
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="table-thumbnail"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>
                      <span className="product-category-tag" style={{ margin: 0 }}>
                        {product.category}
                      </span>
                    </td>
                    <td>
                      <strong>${Number(product.price).toFixed(2)}</strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.45rem' }}
                          onClick={() => handleQuickStockChange(product, -1)}
                          disabled={product.stock <= 0}
                          title="Decrease Stock"
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                          {product.stock}
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.45rem' }}
                          onClick={() => handleQuickStockChange(product, 1)}
                          title="Increase Stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`stock-badge ${
                          isOutOfStock ? 'stock-out' : 'stock-in'
                        }`}
                      >
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="btn btn-secondary btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product._id, product.name)
                          }
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminProducts;
