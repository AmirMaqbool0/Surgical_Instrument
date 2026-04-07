import React from 'react'
import './style.css'
import { AuthBanner } from '../../../components'
const EmailVarification = () => {
  return (
    <div className='email-varification-main-container'>
      <AuthBanner />
    <div className='email-varification-container'>
      <div className="email-varification-heading">
        <span>Let’s verify your email</span>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        Sit aliquid, Non distinctio vel iste.</p>
      </div>
      <div className="email-varification-content">
        <input type="text" placeholder='Email*' />
        <span>Verify your account through email.</span>
        <button>SEND</button>
      </div>
    </div>
    </div>
  )
}

export default EmailVarification