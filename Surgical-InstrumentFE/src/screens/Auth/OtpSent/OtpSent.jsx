import React, { useState } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkOtp } from "../../../redux/Auth/otpCheckSlice";
import { AuthBanner } from "../../../components";

const OtpSent = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.otpCheck);

  const email = sessionStorage.getItem("email"); // Get email from session
  const token = sessionStorage.getItem("otpToken"); // Get token from session

  const handleFocus = (index) => setActiveIndex(index);
  const handleBlur = () => setActiveIndex(null);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) { // Allow only numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleSubmit = () => {
    console.log('Funtion is fired...')
    const otpCode = otp.join(""); 
    if (otpCode.length === 6 && email && token) {
      dispatch(checkOtp({ email, otp: otpCode, token }));
    }
  };

  // Redirect if OTP is verified
  if (success) {
    navigate("/newpassword");
  }
  console.log(success)
  console.log(error)

  return (
    <>
      <AuthBanner />
      <div className="otp-box-main-container">
        <div className="otp-text-heading">
          <span>VERIFY YOUR OTP</span>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit aliquid, non distinctio vel iste.</p>
        </div>

        <div className="otp-main-box">
          {otp.map((digit, index) => (
            <div className="otp-box" key={index}>
              <input
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className={activeIndex === index ? "active-input" : ""}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
              />
            </div>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="otp-confirm-button">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </div>

        <div className="otp-not-recive-text">
          <span>Did not receive OTP?</span>
          <p>Resend OTP</p>
        </div>
      </div>
    </>
  );
};

export default OtpSent;
