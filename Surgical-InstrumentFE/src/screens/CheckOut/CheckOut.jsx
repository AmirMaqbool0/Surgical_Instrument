import React, { useState, useEffect } from "react";
import "./style.css";
import { PageBanner } from "../../components";
import { ArrowDown, Mail, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, resetOrderState } from "../../redux/orderSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUserProfile } from "../../redux/Account/dashboardSlice";
import { updateProfile } from "../../redux/Account/profileUpdateSlice";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart items and order state
  const cartItemsFromState = location.state?.cartItems;
  const cartItemsFromRedux = useSelector((state) => state.cart.cartItems);
  const cartItems = cartItemsFromState || cartItemsFromRedux;
  const { loading, error, success, order } = useSelector(
    (state) => state.order
  );

  // User state
  const user = useSelector((state) => state.dashboard.user);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "USA",
    address: "",
    address2: "",
    city: "Springfield",
    state: "Illinois",
    zipCode: "",
    notes: "",
    paymentMethod: "cash", // default to cash on delivery
    saveInfo: false,
  });

  // Calculate order totals
  const subtotal =
    cartItems?.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    ) || 0;
  const shipping = 15.0;
  const vat = subtotal * 0.1;
  const total = subtotal + shipping + vat;

  // Prefill form fields with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "USA",
      }));
    }
  }, [user]);

  // Hide login prompt if user is logged in
  const isLoggedIn = !!user;

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Format price display
  const formatPrice = (price) => {
    return (Number(price) || 0).toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Show success toast
  const showSuccessToast = (orderId) => {
    toast.success(`Order placed successfully!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  // Show error toast
  const showErrorToast = (message) => {
    toast.error(message || 'Order submission failed. Please try again.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      showErrorToast("Your cart is empty");
      return;
    }

    // Update user profile if changed and saveInfo is checked
    if (user && formData.saveInfo) {
      // Only allowed fields for profile update
      const profileFields = ["firstName", "lastName", "email"];
      const updatedProfile = {};
      profileFields.forEach((field) => {
        if (formData[field] && formData[field] !== (user[field] || "")) {
          updatedProfile[field] = formData[field];
        }
      });
      if (Object.keys(updatedProfile).length > 0) {
        try {
          await dispatch(updateProfile(updatedProfile));
        } catch (err) {
          // Optionally show error but continue with order
        }
      }
    }

    // Prepare cart items for API
    const prepareCartItems = () => {
      return cartItems.flatMap(item => {
        if (item.isBundle && item.products) {
          // For bundles, include each product in the bundle
          return item.products.map(product => ({
            product_id: product._id || product.id,
            quantity: item.quantity,
            price: product.price
          }));
        } else {
          // For regular products
          return {
            product_id: item._id || item.id,
            quantity: item.quantity,
            price: item.price
          };
        }
      });
    };

    // Prepare order data according to API schema
    const personalInfo = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      country: formData.country,
    };
    if (formData.notes && formData.notes.trim() !== "") {
      personalInfo.notes = formData.notes;
    }
    const orderData = {
      personal_info: personalInfo,
      cart_info: prepareCartItems(),
      currency: "USD",
      amount: total,
      discount_amount: 0,
      delivery_charges: shipping,
      payment_info: {
        mode: formData.paymentMethod === 'cash' ? 'cod' : formData.paymentMethod,
        platform: "web"
      },
      delivery_info: {
        status: "pending",
        delivery_charges: shipping,
        delivery_address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`
      }
    };

    try {
      const result = await dispatch(createOrder(orderData));
      if (createOrder.fulfilled.match(result)) {
        showSuccessToast(result.payload.orderId || result.payload._id);
        // Reset form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "USA",
          address: "",
          address2: "",
          city: "Springfield",
          state: "Illinois",
          zipCode: "",
          notes: "",
          paymentMethod: "cash",
          saveInfo: false,
        });
        // You can also navigate to order confirmation page if needed
        // navigate("/order-confirmation", { state: { order: result.payload } });
      } else if (createOrder.rejected.match(result)) {
        showErrorToast(result.error.message);
      }
    } catch (err) {
      showErrorToast("An unexpected error occurred");
      console.error("Unexpected error:", err);
    }
  };

  // Reset order state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetOrderState());
    };
  }, [dispatch]);

  // Show toast when order is successfully completed
  useEffect(() => {
    if (success && order) {
      showSuccessToast(order.orderId || order._id);
    }
    if (error) {
      showErrorToast(error.message);
    }
  }, [success, order, error]);

  return (
    <div className="checkout-container">
      <PageBanner title={"Checkout"} />
      {/* Toast Container - should be placed at the root level */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="checkout-content">
        {/* Hide login prompt if logged in */}
        {!isLoggedIn && (
          <div className="checkout-login-prompt">
            Returning customer? <a href="/login">Click here to login</a>
          </div>
        )}
        <div className="returing-btn">
          <span>Have a coupon? </span>
          <p>Click here to enter your code</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form-content">
          <div className="checkout-content-right">
            {/* Billing Details Form */}
            <div className="form-heading">
              <span>Billing Details</span>
            </div>
            <div className="biling-form">
              <span>Personal Information</span>
              <div className="form-inputs">
                <div className="form-input">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <User color="rgba(40, 132, 106, 1)" />
                </div>
                <div className="form-input">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <User color="rgba(40, 132, 106, 1)" />
                </div>
                <div className="form-input">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Mail color="rgba(40, 132, 106, 1)" />
                </div>
                <div className="form-input">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <Mail color="rgba(40, 132, 106, 1)" />
                </div>
                <span>Country</span>
                <div className="form-inputs">
                  <div className="form-input">
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                    <ArrowDown color="rgba(40, 132, 106, 1)" />
                  </div>
                </div>
                <span>Address</span>
                <div className="form-inputs">
                  <div className="form-input">
                    <input
                      type="text"
                      name="address"
                      placeholder="House number and street name"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      type="text"
                      name="address2"
                      placeholder="Apartment, suite, unit etc. (optional)"
                      value={formData.address2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="cities-inputs">
                  <div className="city-input">
                    <span>Town / City</span>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="city-input">
                    <span>State</span>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="city-input">
                    <span>Zip</span>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="save-check-box">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleChange}
                  />
                  <span>Save info</span>
                </div>
              </div>
              <div className="notes">
                <span>Order Notes (optional)</span>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-heading">
              <span>Payment Method</span>
            </div>
            <div className="payment-box">
              <label
                className={`payment-option ${
                  formData.paymentMethod === "stripe" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={formData.paymentMethod === "stripe"}
                  onChange={handleChange}
                />
                <span className="label-text">
                  Stripe Payment{" "}
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/stripe-3.svg"
                    alt="Stripe"
                  />
                </span>
              </label>

              <label
                className={`payment-option ${
                  formData.paymentMethod === "cash" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={handleChange}
                />
                <span className="label-text">Cash on delivery</span>
                <div className="payment-info">Pay with cash upon delivery.</div>
              </label>

              <label
                className={`payment-option ${
                  formData.paymentMethod === "paypal" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleChange}
                />
                <span className="label-text">
                  PayPal{" "}
                  <img
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                    alt="PayPal"
                  />
                </span>
              </label>

              <p className="privacy-text">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </p>

              <button
                type="submit"
                className="place-order"
                disabled={loading || !cartItems || cartItems.length === 0}
              >
                {loading ? "PROCESSING..." : "PLACE ORDER"}
              </button>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="checkout-content-left">
            <div className="form-heading">
              <span>Cart Totals</span>
            </div>
            <div className="cart-total-box">
              {cartItems?.map((item) => (
                <div className="cart-row" key={item.id || item._id}>
                  <span>
                    {item.name} × <strong>{item.quantity}</strong>
                    {item.isBundle && item.products && (
                      <div className="bundle-items">
                        {item.products.map((product) => (
                          <div key={product._id || product.id} className="bundle-item">
                            + {product.name} (${formatPrice(product.price)})
                          </div>
                        ))}
                      </div>
                    )}
                  </span>
                  <span>${formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="cart-row">
                <span>Shipping and Handing</span>
                <span>${formatPrice(shipping)}</span>
              </div>
              <div className="cart-row">
                <span>Vat</span>
                <span>${formatPrice(vat)}</span>
              </div>
              <div className="cart-row total">
                <strong>Order Total</strong>
                <strong>${formatPrice(total)}</strong>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;