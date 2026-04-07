import React, { useState, useEffect } from 'react';
import './style.css';

const HomeBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        { id: 1, image: 'https://rigorinstruments.com/wp-content/uploads/2023/07/post-image-1-1024x512.jpg', alt: 'Banner 1' },
        { id: 2, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8ZOM77QNX6HUWwJs8mU0LdENi54w5wDRg4Q&s', alt: 'Banner 2' },
        { id: 3, image: 'https://i.brecorder.com/primary/2021/12/61b284f1929b9.jpg', alt: 'Banner 3' },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='home-banner-container'>
            <div className='carousel' style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className='slide'
                    >
                        <img src={slide.image} alt={slide.alt} />
                        <div className="slide-content">
                            <span>Global Sourcing for a Global Market</span>
                            <p>For the most precise and delicate surgeries, high-quality instruments are crucial. Invest in instruments that are designed for superior performance, reliability, and durability</p>
                            <button>View Instruments</button>
                        </div>
                    </div>
                ))}
            </div>
            <button className='prev-button' onClick={prevSlide}>&#10094;</button>
            <button className='next-button' onClick={nextSlide}>&#10095;</button>
            <div className="dots-container">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default HomeBanner;