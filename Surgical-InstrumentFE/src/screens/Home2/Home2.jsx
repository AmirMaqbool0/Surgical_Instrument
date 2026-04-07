import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInstrumentCategories } from '../../redux/instrumentCategorySlice';
import { fetchUserProfile } from '../../redux/Account/dashboardSlice';
import { fetchFilteredProducts, fetchAllProductsWithoutCategory } from '../../redux/categoryProductSlice';
import { addToCart } from '../../redux/cartSlice';
import { Header, Footer } from '../../components';
import GetinTouch from '../../components/GetinTouch/GetinTouch';
import './style.css';

const Home2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.instrumentCategory);
  const { user } = useSelector((state) => state.dashboard);
  const cartCount = useSelector((state) => state.cart.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0));
  const { filteredProducts, loading: productLoading, products } = useSelector((state) => state.categoryProduct);

  const [searchType, setSearchType] = useState('Products');
  const [searchValue, setSearchValue] = useState('');
  const [itemNumber, setItemNumber] = useState('');
  const [quantity, setQuantity] = useState(2);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchInstrumentCategories());
    dispatch(fetchUserProfile());
    dispatch(fetchAllProductsWithoutCategory());
  }, [dispatch]);

  // Live filter for item number (product_number)
  useEffect(() => {
    if (itemNumber.trim().length > 0) {
      const filtered = products.filter(p =>
        p.product_number && p.product_number.toLowerCase().startsWith(itemNumber.trim().toLowerCase())
      );
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      setSearchResults([]);
    }
  }, [itemNumber, products]);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    const searchParams = new URLSearchParams({
      type: searchType.toLowerCase(),
      query: searchValue.trim(),
    });
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleUserClick = () => {
    navigate('/account-setting');
  };

  const handleItemNumberChange = (e) => {
    setItemNumber(e.target.value);
    setSelectedProduct(null);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleResultClick = (product) => {
    setSelectedProduct(product);
    setItemNumber(product.product_number);
    setShowDropdown(false);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    dispatch(addToCart({
      id: selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      images: selectedProduct.images,
    }));
    setItemNumber('');
    setQuantity(2);
    setSelectedProduct(null);
    setShowDropdown(false);
  };

  // Utility to capitalize first letter
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  return (
    <div className="home2-wrapper">
      <Header />
      <div className="home2-main">
        <div className="home2-topbar">
          <select
            className="home2-category-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <option value="Products">Products</option>
            <option value="Categories">Categories</option>
            <option value="Bundles">Bundles</option>
          </select>
          <input
            className="home2-search"
            placeholder={`Search ${searchType.toLowerCase()}...`}
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button className="home2-search-btn" onClick={handleSearch}>
            🔍
          </button>
          <div className="home2-user-info">
            <span onClick={handleUserClick}>{user ? `${user.firstName} ${user.lastName || ''}` : 'Loading...'}</span>
            <span className="home2-user-role" onClick={handleUserClick}>{user ? 'Customer' : ''}</span>
            <span className="home2-cart-wrapper" onClick={handleCartClick}>
              🛒
              <span className="home2-cart-badge">{cartCount}</span>
            </span>
          </div>
        </div>
        <h2 className="home2-welcome">
          Welcome back {user && user.firstName ? capitalize(user.firstName) : 'User'}!
        </h2>
        <p className="home2-subtext">Ready to manage your orders? Lets get started with your daily tasks.</p>
        <div className="home2-cards-row">
          <div className="home2-card home2-card-green">
            <h3>Start New Order</h3>
            <p>Browse products and create orders instantly</p>
          </div>
          <div className="home2-card home2-card-blue">
            <h3>My Shopping Lists</h3>
            <p>Access your saved product collections</p>
          </div>
          <div className="home2-card home2-card-red">
            <h3>Scheduled Orders</h3>
            <p>Manage your automated deliveries</p>
          </div>
        </div>
        <div className="home2-main-row">
          <div className="home2-add-cart">
            <h4>Quick Add to Cart</h4>
            <label>Item Number</label>
            <input
              placeholder="#1234..."
              value={itemNumber}
              onChange={handleItemNumberChange}
              onFocus={() => itemNumber && setShowDropdown(true)}
              autoComplete="off"
            />
            {showDropdown && searchResults.length > 0 && (
              <div className="quick-add-dropdown">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="quick-add-dropdown-item"
                    onClick={() => handleResultClick(product)}
                  >
                    {product.product_number} - {product.name}
                  </div>
                ))}
              </div>
            )}
            <label>Quantity</label>
            <select value={quantity} onChange={handleQuantityChange}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
            <button className="home2-add-btn" onClick={handleAddToCart} disabled={!selectedProduct}>
              Add to Cart
            </button>
          </div>
          <div className="home2-quick-nav">
            <h4>Quick Navigation</h4>
            <ul>
              <li className="active">Dashboard</li>
              <li>Order History</li>
              <li>Saved Items</li>
              <li>Payment</li>
              <li>Returns</li>
              <li>Settings</li>
            </ul>
          </div>
          <div className="home2-notifications">
            <h4>Notifications</h4>
            <ul>
              <li>Saved Carts <span>21</span></li>
              <li>Backorders <span>21</span></li>
              <li>Payment Due <span>12</span></li>
              <li>Returns <span>01</span></li>
              <li>Vaccine Pre-book <span>--</span></li>
              <li>Savings <span>01</span></li>
            </ul>
          </div>
        </div>
        <GetinTouch />
      </div>
      <Footer />
    </div>
  );
};

export default Home2; 