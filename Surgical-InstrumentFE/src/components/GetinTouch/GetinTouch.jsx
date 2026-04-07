import React from 'react'
import './style.css'
import BGImg from '../../assets/getintouch.png'
const GetinTouch = () => {
  return (
    <div className='get-in-touch-container'>
        <div className="get-in-touch-box">
       <div className="get-in-touch-img">
        <img src={BGImg} alt="" />
       </div>
       <div className="get-in-touch-content">
        <span>Contact Us</span>
        <h1>Get In Touch With Us Today!</h1>
        <p>We can reference any catalog number from any surgical instrument company</p>
        <button>Contact Us</button>
       </div>
        </div>
    </div>
  )
}

export default GetinTouch