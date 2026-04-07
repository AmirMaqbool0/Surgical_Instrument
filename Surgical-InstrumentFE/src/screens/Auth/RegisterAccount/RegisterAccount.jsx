import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Loader, Check } from "react-feather";
import { AuthBanner } from "../../../components";
import { registerUser } from '../../../redux/Auth/registerUserSlice';
import "./style.css";

const RegisterAccount = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [consent1, setConsent1] = useState(false);
    const [consent2, setConsent2] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success, error } = useSelector((state) => state.registerUser);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!consent1) newErrors.consent1 = 'Please consent to data processing';
        if (!consent2) newErrors.consent2 = 'Please accept the privacy policy';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(registerUser(formData));
        }
    };

    useEffect(() => {
        if (success) {
            navigate('/login');
        }
    }, [success, navigate]);

    return (
        <div className="auth-container">
            <AuthBanner />
            <div className="register-account-main-box">
                <form className="register-account-main-container" onSubmit={handleRegister}>
                    <div className="register-accont-heading">
                        <h1>Register Your Account</h1>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit
                            aliquid, Non distinctio vel iste.
                        </p>
                    </div>

                    <div className="register-inputs-main-box">
                        <div className="input-group">
                            <input 
                                type="text" 
                                name="firstName"
                                placeholder="First Name" 
                                value={formData.firstName} 
                                onChange={handleChange}
                                className={errors.firstName ? 'input-error' : ''}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="input-group">
                            <input 
                                type="text" 
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName} 
                                onChange={handleChange}
                                className={errors.lastName ? 'input-error' : ''}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>

                        <div className="input-group">
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email*" 
                                value={formData.email} 
                                onChange={handleChange}
                                className={errors.email ? 'input-error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="input-group password-input">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                placeholder="Password"
                                value={formData.password} 
                                onChange={handleChange}
                                className={errors.password ? 'input-error' : ''}
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="input-group password-input">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword"
                                placeholder="Confirm Password*" 
                                value={formData.confirmPassword} 
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'input-error' : ''}
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className="confirmation-text">
                        <div className="confirmation-text-box">
                            <label className="checkbox-container">
                                <input 
                                    type="checkbox" 
                                    checked={consent1}
                                    onChange={() => setConsent1(!consent1)}
                                />
                                <span className="checkmark">
                                    {consent1 && <Check size={14} color="white" />}
                                </span>
                                <span className={errors.consent1 ? 'text-error' : ''}>
                                    I consent to Herboil processing my personal data in order to send
                                    personalized marketing material in accordance with the consent
                                    form and the privacy policy.
                                </span>
                            </label>
                            {errors.consent1 && <span className="error-message">{errors.consent1}</span>}
                        </div>

                        <div className="confirmation-text-box">
                            <label className="checkbox-container">
                                <input 
                                    type="checkbox" 
                                    checked={consent2}
                                    onChange={() => setConsent2(!consent2)}
                                />
                                <span className="checkmark">
                                    {consent2 && <Check size={14} color="white" />}
                                </span>
                                <span className={errors.consent2 ? 'text-error' : ''}>
                                    By clicking "create account", I consent to the privacy policy.
                                </span>
                            </label>
                            {errors.consent2 && <span className="error-message">{errors.consent2}</span>}
                        </div>
                    </div>

                    <div className="register-account-button">
                        <button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader className="spin-loader" size={18} />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                        {error && <span className="form-error-message">{error}</span>}
                    </div>

                    <div className="register-account-term-poilices-text">
                        <span>By creating an account, you agree to our:</span>
                        <div className="policy-links">
                            <Link to="/terms">TERMS OF CONDITIONS</Link>
                            <span> | </span>
                            <Link to="/privacy">PRIVACY POLICY</Link>
                        </div>
                        <div className="sign-in-link">
                            <span>ALREADY HAVE AN ACCOUNT? </span>
                            <Link to="/signin">SIGN IN</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterAccount;