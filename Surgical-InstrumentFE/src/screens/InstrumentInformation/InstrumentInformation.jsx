import React from 'react'
import './style.css'
import { GetinTouch, PageBanner } from '../../components'
import { Dot } from 'lucide-react'
import Chart from '../../assets/chart.png'
import Information1 from '../../assets/information1.png'
import Information2 from '../../assets/information2.png'
import Information3 from '../../assets/information3.png'
const InstrumentInformation = () => {
  return (
    <div className='instrument-information-container'>
        <PageBanner  title={'Instrument Information'}/>
        <div className="instru-information-content">
            <div className="instru-info-detail">
                 <div className="instru-detail-left">
                      <img src={Information1} alt="" />
                 </div>
                 <div className="instru-detail-right">
                  <div className="instro-detail-header">
                      <span>Reliable Instrumentation</span>
                    <div className="instru-header-point">
                        <Dot />
                        <span>Reliable Industry Partner</span>
                    </div>
                  </div>
                  <div className="instru-detail-right-text">
                    <span>Product Information</span>
                    <p>When you need quality instrumentation at affordable prices, turn to gSource — your go-to surgicals shop. We are a reliable industry partner with over 20 years of experience providing surgical supplies. As a surgical tool seller, we have built partnerships with heritage German suppliers and other accredited and certified suppliers.</p>
                    <button>View instruments</button>
                  </div>
                 </div>
            </div>
           
        </div>
        <div className="instru-info2">
                <div className="instro-info2-left">
                    <span>Product Manufacturing</span>
                    <p>When you need quality instrumentation at affordable prices, turn to gSource — your go-to surgicals shop. We are a reliable industry partner with over 20 years of experience providing surgical supplies. As a surgical tool seller, we have built partnerships with heritage German suppliers and other accredited and certified suppliers.</p>
                </div>
                <div className="instru-info2-right">
                    <img src={Information2} alt="" />
                </div>
            </div>
            <div className="manufacturing-process">
                 <div className="manufacturing-heading">
                    <span>Manufacturing Process</span>
                    <p>Most gSource surgical instruments are made from German stainless steel type 1.4021 – equivalent to American steel type 420.  This steel is highly corrosion resistant and has excellent longevity when properly maintained.  Steel type 1.4021 is composed primarily of iron. Other components are:</p>
                    <button>View instructions</button>
                 </div>
                 <div className="manufacturing-chart">
                    <img src={Chart} alt="" />
                 </div>
            </div>
            <div className="instru-info3">
                <div className="instru-info-left">
                    <span>Heat Treatment</span>
                    <p>Heat treating makes the instruments hard and enables them to withstand rigorous use.  Stainless steel is brought to a very high temperature and then cooled until it has reached the proper hardness.  Hardness is measured in units called Rockwell Hardness (HRc).  A typical hardness range for needle holders is HRc 40-48.  For scissors, the range is HRc 50-58.</p>
                    <p>Heat treating and steel selection are just two of the more than 80 steps required to produce surgical instruments to gSource standards. We monitor and verify the accuracy of our manufacturing process through frequent audits</p>
                    <button>View steps</button>
                </div>
                <div className="instru-info-right">
                     <img src={Information3} alt="" />
                </div>
            </div>
            <GetinTouch />
    </div>
  )
}

export default InstrumentInformation