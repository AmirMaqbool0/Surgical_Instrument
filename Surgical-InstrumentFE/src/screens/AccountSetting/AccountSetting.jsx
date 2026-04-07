import React, { useState, useEffect } from "react";
import "./style.css";
import { PageBanner } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../redux/Account/dashboardSlice";
import { fetchLatestOrder } from "../../redux/Account/latestOrderSlice";
import { changePassword } from "../../redux/Account/changePasswordSlice";
import { updateProfile } from "../../redux/Account/profileUpdateSlice";
import { fetchOrderList } from "../../redux/Account/orderListSlice";
import { useNavigate } from "react-router-dom";
import ReactModal from 'react-modal';

import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaMapMarkerAlt,
  FaUniversity,
  FaSignOutAlt,
  FaEdit,
  FaBars,
  FaTimes
} from "react-icons/fa";
import PaypalLogo from "../../assets/paypal.webp";
import PaymentMethod1 from "../../assets/payment-method1.png";
import PaymentMethod2 from "../../assets/payment-method2.png";
import PaymentMethod3 from "../../assets/payment-method3.png";
import PaymentMethod4 from "../../assets/payment-method4.png";

const AccountSetting = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.dashboard);
  const { personalInfo, deliveryInfo } = useSelector(
    (state) => state.latestOrder
  );
  const { orders } = useSelector((state) => state.orderList);
  const { loading: isProfileUpdating } = useSelector(
    (state) => state.profileUpdate
  );
  const { loading: isPasswordChanging } = useSelector(
    (state) => state.changePassword
  );
  const navigate = useNavigate();

  // Redirect guests to login
  useEffect(() => {
    if (!user && !loading) {
      navigate("/login", { state: { message: "Please log in to view your account and order history." } });
    }
  }, [user, loading, navigate]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchLatestOrder());
    dispatch(fetchOrderList());
  }, [dispatch]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await dispatch(updateProfile(profileForm));
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    try {
      await dispatch(
        changePassword({
          current_password: currentPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        })
      );
      // Clear fields after successful change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Password change failed:", error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="account-setting-container">
      <PageBanner title={"Account Setting"} />
      <div className="account-setting-content">
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          {mobileMenuOpen ? "Close Menu" : "Account Menu"}
        </button>
        
        <div className={`account-setting-tabs ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <ul>
            <li
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
            >
              <FaHome /> Dashboard
            </li>
            <li
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => {
                setActiveTab("orders");
                setMobileMenuOpen(false);
              }}
            >
              <FaClipboardList /> Orders
            </li>
            <li
              className={activeTab === "account-details" ? "active" : ""}
              onClick={() => {
                setActiveTab("account-details");
                setMobileMenuOpen(false);
              }}
            >
              <FaUser /> Account Details
            </li>
            <li
              className={activeTab === "address" ? "active" : ""}
              onClick={() => {
                setActiveTab("address");
                setMobileMenuOpen(false);
              }}
            >
              <FaMapMarkerAlt /> Address
            </li>
            <li
              className={activeTab === "bank-details" ? "active" : ""}
              onClick={() => {
                setActiveTab("bank-details");
                setMobileMenuOpen(false);
              }}
            >
              <FaUniversity /> Bank Details
            </li>
            <li
              onClick={() => {
                sessionStorage.clear();
                navigate("/login"); 
              }}
            >
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        </div>

        <div className="account-setting-tab-content">
          {activeTab === "dashboard" && (
            <>
              <div className="welcome-box">Hello {user?.firstName}</div>
              <div className="description-box">
                From your account dashboard you can view your recent orders,
                manage your shipping and billing addresses, and edit your
                password and account details.
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div className="orders-table-container">
              <div className="table-responsive">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((order) => (
                      <tr key={order.id}>
                        <td>{order.index}</td>
                        <td>{order.date}</td>
                        <td>{order.status}</td>
                        <td>{order.total}</td>
                        <td>
                          <span className="view-link" onClick={() => openOrderModal(order)}>View</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ReactModal
                isOpen={isOrderModalOpen}
                onRequestClose={closeOrderModal}
                contentLabel="Order Details"
                className="order-modal"
                overlayClassName="order-modal-overlay"
                ariaHideApp={false}
              >
                <button className="close-modal-btn" onClick={closeOrderModal}>Close</button>
                <h2>Order Details</h2>
                {selectedOrder ? (
                  <div className="order-details-content">
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Date:</strong> {selectedOrder.date}</p>
                    <p><strong>Status:</strong> {selectedOrder.status}</p>
                    <p><strong>Total:</strong> {selectedOrder.total}</p>
                    {/* Add more fields as needed */}
                  </div>
                ) : (
                  <p>No order selected.</p>
                )}
              </ReactModal>
            </div>
          )}

          {activeTab === "account-details" && (
            <div className="account-details-form-container">
              <form
                className="account-details-form"
                onSubmit={handleProfileSubmit}
              >
                <div className="section-title">Personal Information</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>First name:</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last name:</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Display Name:</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Display name"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Display Email:</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="example@example.com"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="password-section">
                  <div className="section-title">Password Change</div>
                  <div className="form-group">
                    <label>
                      Current password (leave blank to leave unchanged):
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      New password (leave blank to leave unchanged):
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm new password:</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={isUpdatingProfile || isProfileUpdating}
                  >
                    {isUpdatingProfile || isProfileUpdating ? (
                      <span className="button-loading">
                        <span className="spinner"></span> Updating...
                      </span>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    className="save-btn password-btn"
                    style={{ marginLeft: "20px" }}
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword || isPasswordChanging}
                  >
                    {isChangingPassword || isPasswordChanging ? (
                      <span className="button-loading">
                        <span className="spinner"></span> Changing...
                      </span>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "address" && (
            <div className="address-section">
              <div className="address-note">
                The following addresses will be used on the checkout page by
                default.
              </div>
              <div className="address-container">
                <div className="address-box">
                  <div className="address-header">
                    <h3>BILLING ADDRESS</h3>
                    <span className="edit-link">
                      <FaEdit /> Edit
                    </span>
                  </div>
                  <div className="address-details">
                    <p>{personalInfo?.address}</p>
                    <p>{personalInfo?.city}</p>
                    <p>{personalInfo?.zip_code}</p>
                    <p className="mobile">Mobile: {personalInfo?.phone}</p>
                  </div>
                </div>
                <div className="address-box">
                  <div className="address-header">
                    <h3>SHIPPING ADDRESS</h3>
                    <span className="edit-link">
                      <FaEdit /> Edit
                    </span>
                  </div>
                  <div className="address-details">
                    <p>{personalInfo?.address}</p>
                    <p>{personalInfo?.city}</p>
                    <p>{personalInfo?.zip_code}</p>
                    <p className="mobile">Mobile: {personalInfo?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bank-details" && (
            <div className="bank-details-section">
              <div className="bank-details-note">
                The following addresses will be used on the checkout page by
                default.
              </div>

              <div className="payment-method">
                <div className="payment-header">
                  <img src={PaypalLogo} alt="PayPal" />
                  <span className="edit-link">
                    <FaEdit /> Edit
                  </span>
                </div>
                <div className="payment-details">
                  <p>Alan Raine</p>
                  <p>xxxx-xxxx-xxxx-5554</p>
                  <p>Expiry: 17/28</p>
                </div>
              </div>

              <div className="payment-methods-title">
                <h3>Payment methods</h3>
              </div>

              <div className="payment-cards">
                <img src={PaymentMethod1} alt="Payment Method 1" />
                <img src={PaymentMethod2} alt="Payment Method 2" />
                <img src={PaymentMethod3} alt="Payment Method 3" />
                <img src={PaymentMethod4} alt="Payment Method 4" />
              </div>

              <div className="card-details-form">
                <h3>CARD DETAILS</h3>
                <div className="form-group">
                  <label>Contributor's name:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label>Card number:</label>
                  <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry:</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="form-group">
                    <label>CVV:</label>
                    <input type="text" placeholder="XXX" />
                  </div>
                </div>
                <button type="submit" className="save-btn">
                  SAVE CHANGES
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;