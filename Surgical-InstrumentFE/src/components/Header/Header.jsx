import React, { useEffect, useState } from "react";
import "./style.css";
import {
  Mail,
  Phone,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchInstrumentCategories } from "../../redux/instrumentCategorySlice";
import { useDispatch, useSelector } from "react-redux";

const Header1 = ({ menuOpen, setMenuOpen, setShowContactModal }) => {
  const [dropdown, setDropdown] = useState(null);
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("token"));
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.instrumentCategory);

  // Check for token updates every 500ms (to catch login changes)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = sessionStorage.getItem("token");
      if (currentToken !== authToken) {
        setAuthToken(currentToken);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [authToken]);

  // Fetch categories once token is available
  useEffect(() => {
    if (authToken) {
      dispatch(fetchInstrumentCategories());
    }
  }, [dispatch, authToken]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    navigate(`/categories?category=${categoryId}`);
  };

  // --- Render ---
  return (
    <div className="header1-wrapper">
      {/* Top Bar */}
      <div className="header1-topbar">
        <div className="header1-contact-group">
          <Phone size={18} color="white" />
          <span>(+92) 111111111</span>
        </div>
        <div className="header1-contact-group">
          <Mail size={18} color="white" />
          <span>Surgical@example.com</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="header1-navbar">
        <div className="header1-logo-group">
          <span className="header1-logo-icon">logo</span>
          <span className="header1-logo-text">ipsum</span>
        </div>
        <nav className="header1-navlinks">
          <div className="header1-navlink header1-has-dropdown">
            <Link to="/categories" className="header1-instruments-link">
              <b>Instruments</b>
            </Link>
            <ChevronDown size={16} />
            {categories && categories.length > 0 && (
              <div className="header1-dropdown">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="header1-dropdown-item"
                    onClick={() => handleCategorySelect(category.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link className="header1-navlink" to="/instrumentbundels">Instrument Bundles</Link>
          <div className="header1-navlink header1-has-dropdown">
            <Link to="/instrumentinformation" className="header1-instruments-link">
              Instrument Information
            </Link>
            <ChevronDown size={16} />
            {/* Dropdown can be implemented if needed */}
          </div>
          <Link className="header1-navlink" to="/company">Company</Link>
          <Link className="header1-navlink" to="/resources">Resources</Link>
          <Link className="header1-navlink" to="/repairs">Repairs</Link>
        </nav>
        <div className="header1-actions">
          <button
            className="header1-contact-btn"
            onClick={() => setShowContactModal && setShowContactModal(true)}
          >
            Contact us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header1;
