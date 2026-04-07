import React from 'react'
import './style.css'
import AuthLogo from '../../assets/authbanner.jpeg'
const AuthBanner = () => {
  return (
    <div className='auth-banner-container'>
        <div className="auth-banner-img">
            <img src={AuthLogo} alt="" />
        </div>
        <div className="auth-banner-text">
            <p>Home/ <span> Sign In</span></p>
            <h1>Sign In To Your Account</h1>
        </div>
    </div>
  )
}

export default AuthBanner