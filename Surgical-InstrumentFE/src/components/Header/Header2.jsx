import React, { useEffect, useState } from "react";
import "./style.css";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInstrumentCategories } from "../../redux/instrumentCategorySlice";
import { fetchUserProfile } from "../../redux/Account/dashboardSlice";
import { useNavigate } from "react-router-dom";
import avatarPlaceholder from "../../assets/brandlogo.png"; // Use your own placeholder if needed

const Header2 = ({ menuOpen, setMenuOpen, showMenuIcon }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { categories } = useSelector((state) => state.instrumentCategory);
  const { user } = useSelector((state) => state.dashboard);
  const cartCount = useSelector((state) => state.cart.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0));

  // Local state for search and category
  const [searchType, setSearchType] = useState("Products");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    dispatch(fetchInstrumentCategories());
    const token = sessionStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  // Handlers
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  const handleSearch = () => {
    if (!searchValue.trim()) return;
    
    // Navigate to search results page with search parameters
    const searchParams = new URLSearchParams({
      type: searchType.toLowerCase(),
      query: searchValue.trim()
    });
    
    navigate(`/search?${searchParams.toString()}`);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/account-setting");
    }
  };

  // Get user name and role
  const userName = user ? `${user.firstName} ${user.lastName || ""}` : "";
  const userRole = "Customer"; // Default role since Customer model doesn't have role field

  return (
    <div className="header2-main-container">
      {showMenuIcon && (
        <div className="header2-menu-icon" onClick={() => setMenuOpen && setMenuOpen(!menuOpen)}>
          <Menu size={28} />
        </div>
      )}
      <div className="header2-search-section">
        <select
          className="header2-category-dropdown"
          value={searchType}
          onChange={handleSearchTypeChange}
        >
          <option value="Products">Products</option>
          <option value="Categories">Categories</option>
          <option value="Bundles">Bundles</option>
        </select>
        <div className="header2-search-bar">
          <input
            type="text"
            placeholder={`Search ${searchType.toLowerCase()}...`}
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <button className="header2-search-btn" onClick={handleSearch}>
            <Search size={20} />
          </button>
        </div>
      </div>
      <div className="header2-user-cart-section">
        <div className="header2-user-info" onClick={handleUserClick}>
          <img
            src={user?.profile_pic || avatarPlaceholder}
            alt="avatar"
            className="header2-avatar"
          />
          <div className="header2-user-details">
            {user ? (
              <>
                <span className="header2-user-name">{userName}</span>
                <span className="header2-user-role">{userRole}</span>
              </>
            ) : (
              <button className="header2-login-btn" onClick={() => navigate('/login')}>Login</button>
            )}
          </div>
        </div>
        <div className="header2-cart-btn" onClick={handleCartClick}>
          <ShoppingCart size={20} />
          <span className="header2-cart-count">{cartCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Header2; 