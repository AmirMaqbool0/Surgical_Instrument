import React from 'react'
import './style.css'
import { FeatureProducts, GetinTouch, HomeBanner, ProductUses } from '../../components'
import { Dot } from 'lucide-react'
import Video from '../../assets/video.mp4'
import Marquee from "react-fast-marquee";
import BrandLogo from '../../assets/brandlogo.png'

const Home = () => {
  return (
    <div className='home-container'>
      <HomeBanner />
      <FeatureProducts />
      <div className="feature-about">
        <div className="feature-about-left">
          <div className="feature-about-top">
            <span>Reliable Instrumentation</span>
            <div className="feature-about-point">
              <Dot color='black' />
              <span>Reliable Industry Partner</span>
            </div>
          </div>
          <span>Navigating Care & Cure Surgico Strength by the Numbers</span>
          <p>When you need quality instrumentation at affordable prices, turn to gSource — your go-to surgicals shop. We are a reliable industry partner with over 20 years of experience providing surgical supplies. As a surgical tool seller, we have built partnerships with heritage German suppliers and other accredited and certified suppliers.</p>
          <button>Learn More</button>
        </div>
        <div className="feature-about-right">
          <video src={Video} autoPlay muted ></video>
        </div>
      </div>
      <div className="products-brands">
        <Marquee>
          {
            Array(10).fill().map((_, i) => (
              <div className="brand-logo">
                <img src={BrandLogo} alt="" />
              </div>
            ))
          }

        </Marquee>
      </div>
      <ProductUses />
      <GetinTouch />
    </div>
  )
}

export default Home