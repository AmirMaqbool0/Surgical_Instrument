import React, { useEffect, useState } from "react";
import "./style.css";
import { GetinTouch, PageBanner } from "../../components";
import { Search } from "lucide-react";
import { fetchInstrumentCategories } from "../../redux/instrumentCategorySlice";
import { fetchBundles } from "../../redux/bundleSlice";
import { useDispatch, useSelector } from "react-redux";
import { addBundleToCart } from "../../redux/cartSlice";
import Intrument from "../../assets/instrument.png";
import { Link, useNavigate } from "react-router-dom";

const InstrumentBundels = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.instrumentCategory);
  const { bundles, loading: bundlesLoading, error: bundlesError } = useSelector((state) => state.bundle);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchInstrumentCategories());
    dispatch(fetchBundles());
  }, [dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleClearFilter = () => {
    setSelectedCategory(null);
    setCurrentPage(1); // Reset to first page when clearing filter
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleAddToCart = (bundle) => {
    const bundleToAdd = {
      items: bundle.items || bundle.products || [],
      bundleName: bundle.name,
      bundleQuantity: 1,
      price: bundle.price,
      image: bundle.image || Intrument,
      description: bundle.short_desc || bundle.description || ""
    };

    dispatch(addBundleToCart(bundleToAdd));
    // Don't navigate to cart - stay on current page
  };

  // Calculate cart totals
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return acc + (price * quantity);
  }, 0);

  const formatPrice = (price) => {
    return (Number(price) || 0).toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Filter bundles based on selected category and search query
  const filteredBundles = bundles?.filter(bundle => {
    const matchesCategory = !selectedCategory || bundle.category_id === selectedCategory.id;
    const matchesSearch = !searchQuery || 
      bundle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bundle.short_desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bundle.long_desc?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }) || [];

  // Pagination logic
  const bundlesPerPage = 6;
  const totalPages = Math.ceil(filteredBundles.length / bundlesPerPage);
  const paginatedBundles = filteredBundles.slice(
    (currentPage - 1) * bundlesPerPage,
    currentPage * bundlesPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bundels-container">
      <PageBanner title={"Categories"} />
      <div className="bundels-content">
        <div className="bundels-heading">
          <span>Surgical Instruments Bundles</span>
          <p>
            A reliable source for quality instrumentation crafted from German surgical stainless steel or machined from US surgical stainless steel. Quickly find the surgical instrument you need by using our instrument search or find the best match to another manufacturer's part number in our extensive cross-reference database
          </p>
        </div>
        <div className="instrument-bundle-section" style={{ display: "flex", gap: "2rem" }}>
          {/* Sidebar */}
          <aside className="instrument-sidebar" style={{ flex: "0 0 280px" }}>
            <div className="filter-sidebar">
              <button
                className="clear-filter-btn"
                onClick={handleClearFilter}
                disabled={!selectedCategory}
                style={{ 
                  marginBottom: 16, 
                  padding: '8px 16px', 
                  borderRadius: 6, 
                  border: '1px solid #00b482', 
                  background: selectedCategory ? '#00b482' : '#f2f8f6', 
                  color: selectedCategory ? '#fff' : '#00b482', 
                  fontWeight: 600, 
                  cursor: selectedCategory ? 'pointer' : 'not-allowed' 
                }}
              >
                Clear Filter
              </button>
              <h2>Category</h2>
              <ul className="category-list">
                <li>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={!selectedCategory}
                      onChange={() => handleClearFilter()}
                    />
                    All Categories
                  </label>
                </li>
                {categories?.map((category) => (
                  <li key={category.id}>
                    <label>
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory?.id === category.id}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {category.name}
                    </label>
                  </li>
                ))}
              </ul>
              {/* Expandable filters (placeholders) */}
              <details style={{ marginTop: "1rem" }}>
                <summary>Length</summary>
                {/* Add length filter options here */}
              </details>
              <details>
                <summary>Tip size</summary>
                {/* Add tip size filter options here */}
              </details>
              <details>
                <summary>Material</summary>
                {/* Add material filter options here */}
              </details>
            </div>
            {/* Cart summary */}
            <div className="cart-summary">
              <h3>Cart Summary</h3>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <div>
                    {cartItems.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="cart-item-preview">
                        <div className="cart-item-info">
                          <div className="cart-item-name">
                            {item.name?.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                          </div>
                          <div className="cart-item-qty">
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="cart-item-price">
                          ${formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <div className="cart-more-items">
                        +{cartItems.length - 3} more items
                      </div>
                    )}
                  </div>
                  <div className="cart-subtotal">
                    <span className="cart-subtotal-label">Subtotal:</span>
                    <span className="cart-subtotal-value">
                      ${formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <div className="cart-actions">
                    <Link to="/cart" className="cart-btn cart-btn-primary">
                      View Cart ({cartItems.length})
                    </Link>
                    <Link to="/checkout" className="cart-btn cart-btn-secondary">
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </aside>
          {/* Main Content */}
          <main className="instrument-main-content" style={{ flex: 1 }}>
            {/* Search bar */}
            <div className="search-container" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", maxWidth: 400 }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search bundles..."
                className="search-bar"
                style={{ flex: 1, marginLeft: 8 }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    marginLeft: "8px",
                    color: "#666"
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            {/* Bundle List */}
            {bundlesLoading ? (
              <div className="products-loading">
                <span className="loader" />
                <p>Loading bundles...</p>
              </div>
            ) : bundlesError ? (
              <div className="error-container">
                <h2>Error loading bundles</h2>
                <p>{typeof bundlesError === "string" ? bundlesError : "An error occurred."}</p>
              </div>
            ) : filteredBundles && filteredBundles.length > 0 ? (
              <>
                <div className="results-info" style={{ marginBottom: "1rem", color: "#666", fontSize: "14px" }}>
                  Showing {((currentPage - 1) * bundlesPerPage) + 1} to {Math.min(currentPage * bundlesPerPage, filteredBundles.length)} of {filteredBundles.length} bundles
                  {selectedCategory && ` in ${selectedCategory.name}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </div>
                <div className="bundles-list-vertical">
                  {paginatedBundles.map((bundle) => (
                    <div key={bundle._id || bundle.id} className="bundle-card" style={{ display: "flex", alignItems: "center", background: "#f8f8f8", borderRadius: 8, padding: "1rem", marginBottom: "1rem" }}>
                      <div className="bundle-image" style={{ width: 80, height: 80, marginRight: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "#e6f7f4", borderRadius: 8 }}>
                        <img
                          src={bundle.image || Intrument}
                          alt={bundle.name}
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 4px 0", fontSize: 18 }}>{bundle.name}</h3>
                        <div style={{ color: "#1a7f37", fontWeight: 700, fontSize: 20 }}>${bundle.price}</div>
                        <div style={{ color: "#888", fontSize: 13 }}>Products: {bundle.items?.length || 0}</div>
                        <div style={{ color: "#888", fontSize: 13 }}>{bundle.short_desc}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <Link to={`/bundeldetail/${bundle._id || bundle.id}`}>
                          <button style={{ background: "#00b386", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}>
                            View details
                          </button>
                        </Link>
                        <button
                          onClick={() => handleAddToCart(bundle)}
                          style={{ background: "#00b386", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px", fontWeight: 600, cursor: "pointer" }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-number ${currentPage === page ? "active" : ""}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-bundles">
                <p>
                  {searchQuery 
                    ? `No bundles found matching "${searchQuery}"${selectedCategory ? ` in ${selectedCategory.name}` : ""}.`
                    : selectedCategory 
                      ? `No bundles available for ${selectedCategory.name}.` 
                      : "No bundles available."
                  }
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
      <GetinTouch />
    </div>
  );
};

export default InstrumentBundels;