import React from 'react'
import './style.css'
import { PageBanner, ProductUses } from '../../components'
import { Dot } from 'lucide-react'
import Information1 from '../../assets/information1.png'
import Information2 from '../../assets/information2.png'
import Information3 from '../../assets/company.png'
const Repairs = () => {
  return (
    <div className='repairs-container'>
        <PageBanner  title={'Repairs'}/>
         <div className="repairs-detail">
            <div className="repairs-details-left">
                <span>Instrument Repair Services</span>
                <p>The gSource catalog contains over 4,100 instruments primarily used in orthopedic and spinal procedures. For a quick answer on availability of other patterns, refer to our web cross reference or email us a copy of the instrument or brand-name part number.
                </p>
                <p>Please inquire about availability of any instrument not shown in the catalog or on the website.</p>
                <button>Download Repair Order Form</button>
            </div>
            <div className="repairs-detail-right">
                <img src={Information1} alt="" />
            </div>
         </div>
            <ProductUses />
         <div className="repairs-details2">
            <div className="repairs-details2-left">
                <img src={Information2} alt="" />
            </div>
            <div className="repairs-details2-right">
                <div className="repairs-detail-right-header">
                    <span>90 Days Guaranteed </span>
                    <div className="repairs-detail-right-point">
                        <Dot  color='gray'/>
                        <span>Cleaned and Sterilized Instrumentation </span>
                    </div>
                </div>
                <div className="repair-detail2-text">
                    <span>Repair Warranty</span>
                    <p>Instruments repaired by gSource repair technicians are guaranteed to be free from defects in material and workmanship for 90 days when used for their intended surgical purpose.  Any repair that proves defective in workmanship or material within this 90 day period will either be repaired again or replaced, at the discretion of gSource, without charge.  Instruments must be cleaned and sterilized prior to returning to gSource.
                    </p>
                    <p>This warranty is void for gSource instruments serviced by any person or facility other than gSource.  Warranty is not valid for gSource instruments that prove defective as a result of improper care and cleaning or misuse.</p>
                  
                </div>
            </div>
         </div>
         <div className="repairs-details3">
            <div className="repairs-details3-left">
                <span>Instructions For Instrument Sharpening or Repair</span>
                <p>Heat treating makes the instruments hard and enables them to withstand rigorous use.  Stainless steel is brought to a very high temperature and then cooled until it has reached the proper hardness.  Hardness is measured in units called Rockwell Hardness (HRc).  A typical hardness range for needle holders is HRc 40-48.  For scissors, the range is HRc 50-58.</p>
                <p>Heat treating and steel selection are just two of the more than 80 steps required to produce surgical instruments to gSource standards. We monitor and verify the accuracy of our manufacturing process through frequent audits</p>
                <button>Contact us</button>
            </div>
            <div className="repairs-details3-right">
                <img src={Information3} alt="" />
            </div>
         </div>
    </div>
  )
}

export default Repairs