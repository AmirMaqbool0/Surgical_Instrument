import React, { useState } from 'react';
import './style.css';
import Image from '../../assets/image.png';
import Image2 from '../../assets/image2.png';
import Image3 from '../../assets/brandlogo.png';
import Image4 from '../../assets/image.png';
import { ArrowLeft, ArrowRight, Dot } from 'lucide-react';

const Slides = [
  { image: Image, text: "Step 1", title: "Computer Aided Design (CAD)", points: ["Preparation of 3D models"] },
  { image: Image2, text: "Step 2", title: "Prototyping", points: ["Creating initial prototypes", "Testing for functionality"] },
  { image: Image3, text: "Step 3", title: "Quality Testing", points: ["Rigorous quality checks", "Ensuring compliance with standards"] },
  { image: Image4, text: "Step 4", title: "Final Production", points: ["Mass production", "Packaging and distribution"] },
];

const ProductUses = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideClick = (index) => {
    setActiveSlide(index);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % Slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + Slides.length) % Slides.length);
  };

  return (
    <div className='product-uses-container'>
      <div className="product-uses-text">
        <span>Quality Management As Finish Line</span>
        <p>Ensuring high-quality surgical instruments is essential for delivering effective patient care. Through rigorous quality management processes, we can guarantee the reliability, precision, and safety of surgical instruments, creating a better healthcare experience for all. It's the finish line where performance, reliability, and compliance converge.</p>
      </div>
      <div className="product-uses-carousel">
        <div className="uses-carousel-left">
          <img src={Slides[activeSlide].image} alt="" className="slide-image" />
        </div>
        <div className="uses-carousel-right">
          <div className="uses-carousel-text">
            <p>{Slides[activeSlide].text}</p>
            <span>{Slides[activeSlide].title}</span>
            <div className="uses-carousel-points">
              {Slides[activeSlide].points.map((point, i) => (
                <div className="uses-carousel-point" key={i}>
                  <Dot />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-slide-container">
            <div className="uses-carousel-slides">
              {Slides.map((slide, i) => (
                <div
                  className={`uses-carousel-slide ${i === activeSlide ? 'active-slide' : ''}`}
                  key={i}
                  onClick={() => handleSlideClick(i)}
                >
                  <img src={slide.image} alt="" />
                </div>
              ))}
            </div>
            <div className="uses-carousel-slides-btns">
              <div className="uses-prev-btn" onClick={handlePrevSlide}>
                <div className="uses-prev-btn-circle">
                  <ArrowLeft size={16} />
                </div>
                <span>Previous step</span>
              </div>
              <div className="uses-next-btn" onClick={handleNextSlide}>
                <div className="uses-next-btn-circle">
                  <ArrowRight size={16} />
                </div>
                <span>Next step</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUses;