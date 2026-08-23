import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icons';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Countdown timer for Deal of the Day
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update search state if URL search param changes
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearch(query);
    }
  }, [searchParams]);

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
          err.response?.data?.message || 'Failed to load products. Please ensure the backend is running.'
        );
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const getCategoryIcon = (categoryName) => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('elect') || cat.includes('tech') || cat.includes('gadget')) return '⚡';
    if (cat.includes('cloth') || cat.includes('wear') || cat.includes('fashion') || cat.includes('shirt')) return '👕';
    if (cat.includes('shoe') || cat.includes('foot')) return '👟';
    if (cat.includes('home') || cat.includes('furn') || cat.includes('decor')) return '🛋️';
    if (cat.includes('book')) return '📚';
    if (cat.includes('watch') || cat.includes('access')) return '⌚';
    return '🛍️';
  };

  return (
    <div className="container page-wrapper">
      {/* 1. HERO SECTION */}
      <section className="hero-wrapper">
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-content">
          <div>
            <div className="hero-tag">
              <Icon name="sparkles" size={15} color="#fbbf24" />
              <span>NEW COLLECTION • 2026 EDITION</span>
            </div>

            <h1 className="hero-title">
              Elevate Your Lifestyle with{' '}
              <span className="hero-title-highlight">Premium Quality</span>
            </h1>

            <p className="hero-desc">
              Discover verified bestsellers, luxury tech, designer apparel, and daily essentials backed by guaranteed 2-day delivery and hassle-free 30-day returns.
            </p>

            <div className="hero-actions">
              <a href="#catalog-section" className="btn btn-primary btn-lg">
                Explore Catalog <Icon name="arrowRight" size={18} />
              </a>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSortBy('price-asc');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline btn-lg"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Hot Deals %
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <h4>50k+</h4>
                <p>Happy Customers</p>
              </div>
              <div className="hero-stat-item">
                <h4>100%</h4>
                <p>Authentic Items</p>
              </div>
              <div className="hero-stat-item">
                <h4>4.9 ★</h4>
                <p>TrustScore Rating</p>
              </div>
            </div>
          </div>

          <div className="hero-card-preview">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⭐ Deal of the Week
              </span>
              <span className="badge-discount">SAVE 30%</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80"
              alt="Premium Headphones"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1rem' }}
            />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              Wireless Noise-Cancelling Pro
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              Ultra-high fidelity acoustic drivers with 40-hour battery life.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>$199.99</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '0.5rem' }}>$289.00</span>
              </div>
              <a href="#catalog-section" className="btn btn-accent btn-sm">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS BAR */}
      <section className="features-grid">
        <div className="feature-box">
          <div className="feature-icon-wrap" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Icon name="truck" size={24} />
          </div>
          <div>
            <h4 className="feature-title">Free Express Shipping</h4>
            <p className="feature-desc">On all orders over $50.00</p>
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
            <Icon name="shieldCheck" size={24} />
          </div>
          <div>
            <h4 className="feature-title">100% Secure Checkout</h4>
            <p className="feature-desc">256-Bit SSL Encrypted</p>
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrap" style={{ background: '#faf5ff', color: '#a855f7' }}>
            <Icon name="refresh" size={24} />
          </div>
          <div>
            <h4 className="feature-title">30-Day Money Back</h4>
            <p className="feature-desc">Hassle-free return policy</p>
          </div>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrap" style={{ background: '#fffbeb', color: '#f59e0b' }}>
            <Icon name="headset" size={24} />
          </div>
          <div>
            <h4 className="feature-title">24/7 VIP Support</h4>
            <p className="feature-desc">Dedicated assistance anytime</p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES GRID */}
      {categories.length > 0 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Explore handpicked products tailored to your preferences</p>
            </div>
            {selectedCategory !== 'all' && (
              <button onClick={() => setSelectedCategory('all')} className="btn btn-secondary btn-sm">
                View All Categories
              </button>
            )}
          </div>

          <div className="categories-carousel">
            <div
              className={`category-card ${selectedCategory === 'all' ? 'selected' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <div className="category-icon-box">🌟</div>
              <span className="category-name">All Items</span>
            </div>

            {categories.map((cat) => (
              <div
                key={cat}
                className={`category-card ${selectedCategory === cat ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="category-icon-box">{getCategoryIcon(cat)}</div>
                <span className="category-name" style={{ textTransform: 'capitalize' }}>
                  {cat}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SPECIAL DEAL OF THE DAY BANNER */}
      <section className="special-deal-banner">
        <div>
          <span className="badge-discount" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            SPECIAL OFFER • 30% OFF
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: '1.2' }}>
            Flash Deal of the Day
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '480px', lineHeight: '1.5' }}>
            Hurry up! Grab top-rated electronics and smart accessories with exceptional price drops. Limited quantities available.
          </p>

          <div className="deal-countdown-box">
            <div className="countdown-unit">
              <div className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>:</span>
            <div className="countdown-unit">
              <div className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-label">Mins</div>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>:</span>
            <div className="countdown-unit">
              <div className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-label">Secs</div>
            </div>
          </div>

          <a href="#catalog-section" className="btn btn-accent btn-lg">
            Claim Your Discount Now →
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80"
            alt="Smart Watch Deal"
            style={{
              maxHeight: '260px',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
              objectFit: 'cover'
            }}
          />
        </div>
      </section>

      {/* 5. MAIN CATALOG / PRODUCTS SECTION */}
      <section id="catalog-section" style={{ marginBottom: '4rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'Featured Catalog' : `${selectedCategory} Collection`}
            </h2>
            <p className="section-subtitle">
              Showing authentic products with real-time stock and prices
            </p>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="shop-filter-bar">
          <div className="shop-filter-group">
            {/* Search Box */}
            <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Icon name="search" size={16} />
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="Search products by title or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.2rem', paddingRight: '2rem' }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort Select */}
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto', minWidth: '170px' }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {(search || selectedCategory !== 'all' || sortBy !== 'newest') && (
              <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                <Icon name="refresh" size={14} /> Reset
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            {products.length} {products.length === 1 ? 'Product found' : 'Products found'}
          </div>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-error"><Icon name="alertCircle" size={18} /> {error}</div>}

        {/* Products Display */}
        {loading ? (
          <div className="loading-spinner-container">
            <div className="spinner" />
            <p>Fetching store catalog...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-state-icon">
              <Icon name="shoppingBag" size={36} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>
              No Products Found
            </h3>
            <p style={{ marginTop: '0.5rem', color: '#64748b', maxWidth: '420px', margin: '0.5rem auto 1.5rem auto' }}>
              {search || selectedCategory !== 'all'
                ? `No products match "${search || selectedCategory}". Try adjusting your filters or keyword.`
                : 'No products currently available in the database. Log in with an Admin account to add items!'}
            </p>
            {(search || selectedCategory !== 'all') && (
              <button onClick={handleResetFilters} className="btn btn-primary">
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 6. CUSTOMER REVIEWS & TESTIMONIALS */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="section-header" style={{ textAlign: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real experiences from verified buyers worldwide</p>
        </div>

        <div className="testimonials-grid">
          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" size={16} />
              ))}
            </div>
            <p className="review-text">
              "Exceptional product quality and blazing-fast shipping! The headphones arrived in perfect condition and sound incredible. Will definitely shop here again."
            </p>
            <div className="reviewer-meta">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Sarah Jenkins"
                className="reviewer-avatar"
              />
              <div>
                <div className="reviewer-name">Sarah Jenkins</div>
                <div className="verified-buyer-badge">
                  <Icon name="checkCircle" size={13} /> Verified Buyer
                </div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" size={16} />
              ))}
            </div>
            <p className="review-text">
              "The checkout was super smooth and my order reached me within 2 days. Customer support was also very helpful when I needed tracking updates!"
            </p>
            <div className="reviewer-meta">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="David Chen"
                className="reviewer-avatar"
              />
              <div>
                <div className="reviewer-name">David Chen</div>
                <div className="verified-buyer-badge">
                  <Icon name="checkCircle" size={13} /> Verified Buyer
                </div>
              </div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" size={16} />
              ))}
            </div>
            <p className="review-text">
              "Unbeatable prices and 100% genuine products. The discounts during the seasonal sale made this my favorite online store. Highly recommended!"
            </p>
            <div className="reviewer-meta">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Elena Gomez"
                className="reviewer-avatar"
              />
              <div>
                <div className="reviewer-name">Elena Gomez</div>
                <div className="verified-buyer-badge">
                  <Icon name="checkCircle" size={13} /> Verified Buyer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE NEWSLETTER CARD */}
      <section className="newsletter-card">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <span className="badge-discount" style={{ background: '#4f46e5', marginBottom: '1rem', display: 'inline-block' }}>
            VIP NEWSLETTER
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Get $20 Off Your First Order
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Join over 50,000+ happy shoppers receiving exclusive weekly promotions, secret coupon drops, and new product announcements.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing! Use promo code SPHERE20 at checkout for $20 off.');
            }}
            className="newsletter-form"
          >
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email address..."
              required
              style={{ background: '#ffffff', color: '#0f172a' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.7rem 1.5rem', whiteSpace: 'nowrap' }}>
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
