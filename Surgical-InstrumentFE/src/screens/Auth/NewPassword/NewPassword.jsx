import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader, CheckCircle } from "react-feather";
import { resetPassword } from "../../../redux/Auth/resetPasswordSlice";
import { AuthBanner } from "../../../components";
import "./style.css";

const NewPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success, error } = useSelector((state) => state.resetPassword);

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    });
    const [passwordStrength, setPasswordStrength] = useState(0);

    const email = sessionStorage.getItem("email");

    useEffect(() => {
        if (!email) {
            navigate("/forgotpassword");
        }
    }, [email, navigate]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                sessionStorage.removeItem("email");
                navigate("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "newPassword") {
            calculatePasswordStrength(value);
        }
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        } else if (passwordStrength < 3) {
            newErrors.newPassword = "Password is too weak";
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm() && email) {
            dispatch(resetPassword({ 
                email, 
                newPassword: formData.newPassword, 
                confirmPassword: formData.confirmPassword 
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="auth-container">
            <AuthBanner />
            <div className="password-reset-container">
                <form onSubmit={handleSubmit} className="password-reset-form">
                    <div className="password-reset-header">
                        <h1>Reset Your Password</h1>
                        <p className="instruction-text">
                            Create a new password for your account. Make sure it's secure and different from previous ones.
                        </p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="password-input-container">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showPassword.newPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={errors.newPassword ? "input-error" : ""}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility("newPassword")}
                            >
                                {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <span className="error-message">{errors.newPassword}</span>
                        )}
                        <div className="password-strength-meter">
                            <div className={`strength-bar ${passwordStrength >= 1 ? "active" : ""}`}></div>
                            <div className={`strength-bar ${passwordStrength >= 2 ? "active" : ""}`}></div>
                            <div className={`strength-bar ${passwordStrength >= 3 ? "active" : ""}`}></div>
                            <div className={`strength-bar ${passwordStrength >= 4 ? "active" : ""}`}></div>
                            <span className="strength-text">
                                {passwordStrength === 0 && "Very Weak"}
                                {passwordStrength === 1 && "Weak"}
                                {passwordStrength === 2 && "Moderate"}
                                {passwordStrength === 3 && "Strong"}
                                {passwordStrength === 4 && "Very Strong"}
                            </span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword.confirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? "input-error" : ""}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => togglePasswordVisibility("confirmPassword")}
                            >
                                {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !formData.newPassword || !formData.confirmPassword}
                    >
                        {loading ? (
                            <>
                                <Loader className="spin-loader" size={18} />
                                <span>Updating Password...</span>
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>

                    {success && (
                        <div className="success-message">
                            <CheckCircle size={20} />
                            <span>Password updated successfully! Redirecting to login...</span>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default NewPassword;