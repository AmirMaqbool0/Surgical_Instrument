import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import {
  Cart,
  Company,
  EmailVarification,
  ForgotPassword,
  Home,
  InstrumentBundels,
  InstrumentDetail,
  InstrumentInformation,
  Instruments,
  NewPassword,
  OtpSent,
  RegisterAccount,
  Repairs,
  Resources,
  SearchResults,
  SignIn,
} from "../screens";
import { Footer, Header, Header2, ScrollToTop } from "../components";
import CheckOut from "../screens/CheckOut/CheckOut";
import PredefineBundel from "../screens/PredefineBundel/PredefineBundel";
import BundelDetail from "../screens/BundelDetail/BundelDetail";
import AccountSetting from "../screens/AccountSetting/AccountSetting";
import { Mail, Phone, X } from "lucide-react";
import Categories from "../screens/Categories/Categories";
import Home2 from "../screens/Home2/Home2";

// Route configuration for better maintainability
const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  ACCOUNT_SETTING: "/account-setting",
  INSTRUMENTS: "/instruments",
  INSTRUMENT_DETAIL: "/instrumentdetail",
  INSTRUMENT_INFORMATION: "/instrumentinformation",
  INSTRUMENT_BUNDELS: "/instrumentbundels",
  BUNDEL_DETAIL: "/bundeldetail",
  COMPANY: "/company",
  REPAIRS: "/repairs",
  RESOURCES: "/resources",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PREDEFINE_BUNDEL: "/predefinebundel",
  SEARCH: "/search",
  FORGOT_PASSWORD: "/forgotpassword",
  OTP_SENT: "/otpsent",
  NEW_PASSWORD: "/newpassword",
  REGISTER_ACCOUNT: "/registeraccount",
  EMAIL_VERIFICATION: "/emailvarification",
};

// Side menu items configuration
const SIDE_MENU_ITEMS = [
  { path: ROUTES.HOME, label: "Home" },
  { path: ROUTES.INSTRUMENTS, label: "Instruments" },
  { path: "/categories", label: "Categories" },
  { path: ROUTES.INSTRUMENT_INFORMATION, label: "Instrument Information" },
  { path: ROUTES.INSTRUMENT_BUNDELS, label: "Instrument Bundles" },
  { path: ROUTES.COMPANY, label: "Company" },
  { path: ROUTES.RESOURCES, label: "Resources" },
  { path: ROUTES.REPAIRS, label: "Repairs" },
  { path: ROUTES.CART, label: "Cart" },
  { path: ROUTES.ACCOUNT_SETTING, label: "Account Settings" },
];

const Routing = () => {
  const [token, setToken] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const location = useLocation();

  // Check if current page is homepage
  const isHomePage = location.pathname === '/' || location.pathname === ROUTES.HOME;

  // Token management
  useEffect(() => {
    const currentToken = sessionStorage.getItem("token");
    setToken(currentToken);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Render side menu
  const renderSideMenu = () => (
    <div className={`side-menu${menuOpen ? ' open' : ''}`}>
      <button 
        className="close-menu" 
        onClick={() => setMenuOpen(false)}
        aria-label="Close menu"
      >
        <span style={{ color: 'white', fontSize: 28, lineHeight: 1 }}>&times;</span>
      </button>
      
      {SIDE_MENU_ITEMS.map((item) => (
        <a 
          key={item.path}
          className="header-link" 
          href={item.path}
        >
          {item.label}
        </a>
      ))}
      
      <div className="header-btn">
        <button onClick={() => setShowContactModal(true)}>Contact us</button>
      </div>
    </div>
  );

  // Render headers based on current page
  const renderHeaders = () => {
    if (isHomePage) {
      return (
        <>
          <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} setShowContactModal={setShowContactModal} />
          <Header2 menuOpen={menuOpen} setMenuOpen={setMenuOpen} showMenuIcon={false} />
        </>
      );
    }
    return <Header2 menuOpen={menuOpen} setMenuOpen={setMenuOpen} showMenuIcon={true} />;
  };

  // Render routes
  const renderRoutes = () => (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<SignIn />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.OTP_SENT} element={<OtpSent />} />
      <Route path={ROUTES.NEW_PASSWORD} element={<NewPassword />} />
      <Route path={ROUTES.REGISTER_ACCOUNT} element={<RegisterAccount />} />
      <Route path={ROUTES.EMAIL_VERIFICATION} element={<EmailVarification />} />

      {/* Main Application Routes */}
      <Route path="/home2" element={<Home2 />} />
      <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSetting />} />
      
      {/* Instrument Routes */}
      <Route path={ROUTES.INSTRUMENTS} element={<Instruments />} />
      <Route path={ROUTES.INSTRUMENT_INFORMATION} element={<InstrumentInformation />} />
      <Route path={ROUTES.INSTRUMENT_BUNDELS} element={<InstrumentBundels />} />
      <Route path={`${ROUTES.INSTRUMENT_DETAIL}/:id`} element={<InstrumentDetail />} />
      <Route path={`${ROUTES.BUNDEL_DETAIL}/:id`} element={<BundelDetail />} />
      <Route path={ROUTES.PREDEFINE_BUNDEL} element={<PredefineBundel />} />
      
      {/* Company & Service Routes */}
      <Route path={ROUTES.COMPANY} element={<Company />} />
      <Route path={ROUTES.REPAIRS} element={<Repairs />} />
      <Route path={ROUTES.RESOURCES} element={<Resources />} />
      
      {/* Shopping Routes */}
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.CHECKOUT} element={<CheckOut />} />
      <Route path={ROUTES.SEARCH} element={<SearchResults />} />

      {/* Categories Route */}
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );

  // Contact Modal JSX
  const contactModal = showContactModal && (
    <div className="contact-modal-overlay" onClick={() => setShowContactModal(false)}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h2>Contact Us</h2>
          <button
            className="contact-modal-close"
            onClick={() => setShowContactModal(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="contact-modal-content">
          <div className="contact-item">
            <Phone size={24} color="#4CAF50" />
            <div className="contact-details">
              <h3>Phone</h3>
              <p>(+92) 111111111</p>
            </div>
          </div>
          <div className="contact-item">
            <Mail size={24} color="#4CAF50" />
            <div className="contact-details">
              <h3>Email</h3>
              <p>Surgical@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <ScrollToTop />
      {renderHeaders()}
      {renderSideMenu()}
      {contactModal}
      {renderRoutes()}
      <Footer />
    </div>
  );
};

export default Routing;
