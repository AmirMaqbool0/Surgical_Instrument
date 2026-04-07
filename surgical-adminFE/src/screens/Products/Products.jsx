import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const placeholderImg = 'https://via.placeholder.com/48x48?text=No+Image';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('recent-oldest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortOptions = [
    { label: 'Recent to Oldest', value: 'recent-oldest' },
    { label: 'Oldest to Recent', value: 'oldest-recent' },
    { label: 'A-Z (Name)', value: 'az' },
    { label: 'Z-A (Name)', value: 'za' },
  ];

  useEffect(() => {
    fetch(`${baseUrl}/v1/admin/product/get`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        let productsArr = [];
        if (data && Array.isArray(data.data)) {
          productsArr = data.data;
        } else if (Array.isArray(data)) {
          productsArr = data;
        } else {
          productsArr = [];
        }
        // Normalize created_at field
        const normalized = productsArr.map((prod) => ({
          ...prod,
          created_at: prod.created_at || prod.createdAt || null,
        }));
        setProducts(normalized);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'recent-oldest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortOption === 'oldest-recent') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortOption === 'az') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortOption === 'za') {
      return (b.name || '').localeCompare(a.name || '');
    }
    return 0;
  });

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price || 0);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Products</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              className="sort-btn"
              type="button"
              onClick={() => setSortDropdownOpen((open) => !open)}
              style={{
                padding: '8px 18px 8px 14px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(16,185,129,0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                minWidth: 140,
                transition: 'box-shadow 0.18s',
              }}
            >
              <span style={{ color: '#222' }}>Sort: {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort'}</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginLeft: 2 }}><path d="M6 8l4 4 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {sortDropdownOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 16px rgba(16,185,129,0.10)', zIndex: 10, minWidth: 180, animation: 'fadeIn 0.18s' }}>
                {sortOptions.map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => { setSortOption(opt.value); setSortDropdownOpen(false); }}
                    style={{ padding: '12px 18px', cursor: 'pointer', background: sortOption === opt.value ? '#ECFDF5' : '#fff', color: sortOption === opt.value ? '#10B981' : '#222', fontWeight: sortOption === opt.value ? 600 : 400, borderRadius: 6, transition: 'background 0.15s' }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="create-product-btn" onClick={() => navigate('/products/create')}>
            + Create New Product
          </button>
        </div>
      </div>
      <div className="products-table-section">
        {error && <div className="error-msg">{error}</div>}
        {loading ? (
          <div className="loading-msg">Loading products...</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Product #</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-products">No products found.</td>
                </tr>
              ) : (
                sortedProducts.map((product) => (
                  <tr key={product._id} className="product-row" onClick={() => handleProductClick(product._id)}>
                    <td>
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : placeholderImg}
                        alt={product.name}
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '0.5rem', background: '#f1f5f9', border: '1px solid #e5e7eb', display: 'block', margin: '0 auto' }}
                      />
                    </td>
                    <td>{product.name || 'N/A'}</td>
                    <td>{product.short_desc || 'N/A'}</td>
                    <td>{product.product_number || 'N/A'}</td>
                    <td>{product.quantity ?? 'N/A'}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        .sort-btn:focus { outline: 2px solid #10B981; }
        .sort-btn { transition: background 0.15s, box-shadow 0.18s; }
        .sort-btn:hover { background: #f3f4f6; box-shadow: 0 4px 16px rgba(16,185,129,0.13); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Products;