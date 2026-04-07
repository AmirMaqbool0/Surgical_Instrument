import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { AuthBanner } from "../../../components";
import { Link } from "react-router-dom";
import { loginUser } from "../../../redux/Auth/loginUserSlice";
import { Eye, EyeOff, Loader } from "react-feather";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.loginUser);
  console.log("token afeter login", token);
  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        dispatch(loginUser({ email: email, password: password }));
      } catch (err) {
        console.error("Login error:", err);
      }
    }
  };

  useEffect(() => {
    if (status === "succeeded" && token) {
      sessionStorage.setItem("token", token);
      navigate("/");
    }
  }, [status, token, navigate]);

  return (
    <div className="sign-in">
      <AuthBanner />
      <div className="Sign-in-main-container">
        <div className="signin-text">
          <span>Sign In To Your Account</span>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit
            aliquid, Non distinctio vel iste.
          </p>
        </div>
        <form className="sign-in-form-main-container" onSubmit={handleLogin}>
          <div className="sign-form-left-box">
            <div className="signin-input-box">
              <input
                type="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? "input-error" : ""}
              />
              {emailError && (
                <span className="error-message">{emailError}</span>
              )}

              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password*"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <span className="error-message">{passwordError}</span>
              )}

              {error && (
                <span className="error-message">
                  {typeof error === "string"
                    ? error
                    : error.errors || error.message || "Something went wrong"}
                </span>
              )}

              <Link to={"/forgotpassword"} style={{ textDecoration: "none" }}>
                <span className="forgot-password">FORGOT PASSWORD?</span>
              </Link>
            </div>
            <div className="signin-button">
              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? (
                  <Loader className="spin-loader" size={18} />
                ) : (
                  "SIGN IN"
                )}
              </button>
            </div>
          </div>
          <div className="sign-in-right-box">
            <span>DON'T HAVE AN ACCOUNT?</span>
            <p>
              Add items to your Wishlist get personalized recommendations check
              out more quickly track your orders register
            </p>
            <Link to={"/registeraccount"} style={{ textDecoration: "none" }}>
              <button>CREATE ACCOUNT</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
