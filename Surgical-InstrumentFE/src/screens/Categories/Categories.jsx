import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { fetchInstrumentCategories } from "../../redux/instrumentCategorySlice";
import { fetchAllProducts } from "../../redux/categoryProductSlice";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./style.css";

const Categories = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { categories, loading: catLoading, error: catError } = useSelector((state) => state.instrumentCategory);
  const { products, loading: prodLoading, error: prodError } = useSelector((state) => state.categoryProduct);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Get category from URL parameter
  const urlCategory = searchParams.get("category");

  useEffect(() => {
    dispatch(fetchInstrumentCategories());
  }, [dispatch]);

  // Fetch products when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchAllProducts(selectedCategory));
    }
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  const filteredCategories = categories?.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <div className="categories-page-container">
      {/* Banner */}
      <div className="categories-banner">
        <div className="categories-breadcrumb">Home/ Instruments / Bundles</div>
        <h1>Categories</h1>
        <p>For the most precise and delicate surgeries, high-quality instruments are crucial. Invest in instruments that are designed for superior performance, reliability, and durability</p>
        <button className="categories-banner-btn">View Instruments</button>
      </div>

      {/* Description */}
      <div className="categories-description-section">
        <h2>Surgical Instruments Categories</h2>
        <p>A reliable source for quality instrumentation crafted from German surgical stainless steel or machined from US surgical stainless steel. Quickly find the surgical instrument you need by using our instrument search or find the best match to another manufacturer's part number in our extensive cross-reference database</p>
      </div>

      {/* Main Content */}
      <div className="categories-main-content">
        {/* Sidebar Filters */}
        <aside className="categories-sidebar">
          <button
            className="categories-clear-filter-btn"
            onClick={() => {
              setSelectedCategory(null);
              navigate('/categories');
            }}
            disabled={!selectedCategory}
            style={{ marginBottom: 16, padding: '8px 16px', borderRadius: 6, border: '1px solid #00b482', background: selectedCategory ? '#00b482' : '#f2f8f6', color: selectedCategory ? '#fff' : '#00b482', fontWeight: 600, cursor: selectedCategory ? 'pointer' : 'not-allowed' }}
          >
            Clear Filter
          </button>
          <div className="categories-filter-group">
            <ul>
              {categories?.map((cat) => (
                <li key={cat.id}>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={() => {
                        setSelectedCategory(cat.id);
                        navigate(`/categories?category=${cat.id}`);
                      }}
                    />
                    {cat.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="categories-filter-group">
            <h3>Length</h3>
            {/* Placeholder for length filter */}
          </div>
          <div className="categories-filter-group">
            <h3>Tip size</h3>
            {/* Placeholder for tip size filter */}
          </div>
          <div className="categories-filter-group">
            <h3>Material</h3>
            {/* Placeholder for material filter */}
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

        {/* Categories or Products Grid */}
        <div className="categories-content">
          <div className="categories-content-header">
            <h2>{selectedCategory ? "Instruments" : "Categories"}</h2>
            <div className="categories-search-bar">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                disabled={!!selectedCategory}
              />
            </div>
          </div>
          <div className={selectedCategory ? "categories-products-grid" : "categories-grid"}>
            {selectedCategory ? (
              prodLoading ? (
                <div>Loading products...</div>
              ) : prodError ? (
                <div>Error loading products</div>
              ) : products?.length === 0 ? (
                <div>No products found in this category.</div>
              ) : (
                products.map(product => (
                  <ProductCard data={product} key={product.id} />
                ))
              )
            ) : (
              catLoading ? (
                <div>Loading...</div>
              ) : catError ? (
                <div>Error loading categories</div>
              ) : filteredCategories?.length === 0 ? (
                <div>No categories found.</div>
              ) : (
                filteredCategories.map(cat => (
                  <div
                    className={`category-card${selectedCategory === cat.id ? " selected" : ""}`}
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      navigate(`/categories?category=${cat.id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="category-card-img">
                      <img src={cat.image || "https://via.placeholder.com/100x100?text=Category"} alt={cat.name} />
                    </div>
                    <div className="category-card-name">{cat.name}</div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 