import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch distinct categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products with search, category filter, and sorting
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (sortBy === 'price-asc') params.sort = 'price-asc';
        if (sortBy === 'price-desc') params.sort = 'price-desc';

        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load products. Is backend running?'
        );
      } finally {
        setLoading(false);
      }
    };

    // Debounce search/filter query
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  return (
    <div className="container">
      {/* Hero Banner */}
      <div className="banner">
        <h1 className="banner-title">Discover Our Latest Products</h1>
        <p className="banner-text">
          Phase 2: Product Catalog, Real-Time Search, Category Filters & Stock Tracking
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="filter-toolbar">
        <div className="search-box">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search products by name or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
          </select>
        </div>

        {(search || selectedCategory !== 'all' || sortBy !== 'newest') && (
          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            Reset Filters
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Products Display */}
      {loading ? (
        <div className="loading-center">Loading catalog products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">🛍️</div>
          <h2>No Products Found</h2>
          <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
            {search || selectedCategory !== 'all'
              ? 'Try changing your search terms or category filter.'
              : 'No products have been added yet. Log in as an Admin to add products!'}
          </p>
          {(search || selectedCategory !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="btn btn-primary"
              style={{ marginTop: '1.25rem', width: 'auto' }}
            >
              Show All Products
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
            Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
