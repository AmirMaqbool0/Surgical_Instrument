import React from 'react'
import './style.css'
import BGImg from '../../assets/pagebanner.png'
const PageBanner = ({title}) => {
  return (
    <div className='page-banner-container'>
         <div className="page-banner-bg">
            <img src={BGImg} alt="" />
         </div>
         <div className="page-banner-content">
            <p>Home/ <span>{title}</span></p>
            <h1>{title}</h1>
            <p>For the most precise and delicate surgeries, high-quality instruments are crucial. Invest in instruments that are designed for superior performance, reliability, and durability</p>
            <button>View Instruments</button>
         </div>
    </div>
  )
}

export default PageBanner