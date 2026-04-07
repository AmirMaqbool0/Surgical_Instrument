import React from 'react'
import './style.css'
import { GetinTouch, PageBanner } from '../../components'
import { Check, Dot } from 'lucide-react'
import Information1 from '../../assets/information1.png'
import Information2 from '../../assets/information2.png'
import Information3 from '../../assets/company.png'
const Company = () => {
    return (
        <div className='company-container'>
            <PageBanner title={'Company'}/>
            <div className="company-content">
                <div className="company-detail-header">
                    <div className="company-header-mini">
                        <span>Reliable Instrumentation</span>
                        <div className="company-detail-point">
                            <Dot color='gray' size={30} />
                            <span style={{ color: 'gray' }}>Reliable Industry Partner</span>
                        </div>
                    </div>
                    <span>Company Overview</span>

                </div>
                <div className="company-detail">

                    <div className="company-detail-left">
                        <img src={Information1} alt="" />
                    </div>
                    <div className="company-detail-right">
                        <span>Who We Are</span>
                        <p>When you need quality instrumentation at affordable prices, turn to gSource — your go-to surgicals shop. We are a reliable industry partner with over 20 years of experience providing surgical supplies. As a surgical tool seller, we have built partnerships with heritage German suppliers and other accredited and certified suppliers.</p>
                        <div className="company-detail-btns">
                            <button>View instruments</button>
                            <button className='company-btn2'>Contact Us</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="company-detail2">
                <div className="company-detail2-left">
                    <span>Instrument Catalog</span>
                    <p>The gSource catalog contains over 4,100 instruments primarily used in orthopedic and spinal procedures. For a quick answer on availability of other patterns, refer to our web cross reference or email us a copy of the instrument or brand-name part number.
                    </p>
                    <p>Please inquire about availability of any instrument not shown in the catalog or on the website.</p>
                    <button>Contact Us</button>
                </div>
                <div className="company-detail2-right">
                    <img src={Information2} alt="" />
                </div>
            </div>

            <div className="company-detail3">
                <div className="company-detail3-left">
                     <img src={Information3} alt="" />
                </div>
                <div className="company-detail3-right">
                    <span>Source Attributes</span>
                    <p>Whether crafted from German surgical stainless steel, or machined from U.S. surgical stainless steel, our instruments are recognized by their finely finished surface.</p>
                    {
                        Array(4).fill().map((_,i)=>(
                            <div className="company-detail-point" key={i}>
                            <Check color='rgba(0, 180, 130, 1)'/> 
                            <p>Realistic price</p>
                          </div>
                        ))
                    }
                  
                </div>
            </div>
            <GetinTouch />
        </div>
    )
}

export default Company