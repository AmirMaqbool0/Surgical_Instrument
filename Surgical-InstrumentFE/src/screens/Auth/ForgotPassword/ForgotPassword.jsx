import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from 'react-feather';
import { AuthBanner } from '../../../components';
import { sendOtp } from '../../../redux/Auth/otpSlice';
import './style.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.otp);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (validateEmail()) {
      sessionStorage.setItem('email', email);
      dispatch(sendOtp(email));
      setIsSubmitted(true);
    }
  };

  useEffect(() => {
    if (success && isSubmitted) {
      navigate('/otpsent'); 
    }
  }, [success, isSubmitted, navigate]);

  return (
    <div className="auth-container">
      <AuthBanner />
      <div className="forgetPassword-main-container">
        <form onSubmit={handleSendOtp} className="forget-password-form">
          <h1>FORGOT PASSWORD</h1>
          <p className="instruction-text">
            Enter your email address below and we'll send you a code to reset your password.
          </p>

          <div className="input-group">
            <input 
              type="email" 
              placeholder='Enter your email address*'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail();
              }}
              className={emailError ? 'input-error' : ''}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <Loader className="spin-loader" size={18} />
                <span>Sending...</span>
              </>
            ) : "Send Reset Code"}
          </button>

          {error && <div className="error-message server-error">{error}</div>}

          <div className="back-to-login">
            <span>Remember your password? </span>
            <Link to="/signin">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword;