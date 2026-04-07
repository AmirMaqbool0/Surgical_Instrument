import React, { useState } from 'react';
import Slider from 'react-slick';
import { MoveLeft, MoveRight } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import './style.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../../redux/featuredProductsSlice';

const FeatureProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.featuredProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  let sliderRef = null;

  if (loading) return <p>Loading featured products...</p>;
  if (error) return <p>Error: {error}</p>;
  
  // Handle cases where products.data might be undefined or empty
  const productItems = products?.data || [];
  const productCount = productItems.length;
  
  // Calculate slides to show based on screen size
  const getSlidesToShow = () => {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
  };

  const slidesToShow = Math.min(getSlidesToShow(), productCount);
  const maxSlides = productCount - slidesToShow;
  const canGoNext = currentSlide < maxSlides;
  const canGoPrev = currentSlide > 0;

  if (productCount === 0) {
    return (
      <div className='feature-product-container'>
        <div className="feature-header">
          <span>Featured Products</span>
        </div>
        <p className="no-products-message">No featured products available at the moment.</p>
      </div>
    );
  }

  // Dynamic slider settings based on product count
  const sliderSettings = {
    dots: false,
    infinite: false, // Disable infinite scroll to properly handle arrow states
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: false, // We'll use custom arrows
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(3, productCount),
          infinite: false,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: Math.min(2, productCount),
          infinite: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          infinite: false,
        }
      }
    ]
  };

  return (
    <div className='feature-product-container'>
      <div className="feature-header">
        <span>Featured Products</span>
        {productCount > slidesToShow && ( // Only show arrows if there are more items than can be shown
          <div className="feature-carousel-btn">
            <div 
              className={`prev ${!canGoPrev ? 'disabled' : ''}`} 
              onClick={() => canGoPrev && sliderRef.slickPrev()}
            >
              <MoveLeft color={canGoPrev ? 'rgba(0, 180, 130, 1)' : 'rgba(0, 0, 0, 0.3)'} />
            </div>
            <div 
              className={`next ${!canGoNext ? 'disabled' : ''}`} 
              onClick={() => canGoNext && sliderRef.slickNext()}
            >
              <MoveRight color={canGoNext ? 'rgba(0, 180, 130, 1)' : 'rgba(0, 0, 0, 0.3)'} />
            </div>
          </div>
        )}
      </div>
      <Slider 
        ref={(slider) => (sliderRef = slider)} 
        {...sliderSettings} 
        className="feature-product-carousel"
      >
        {productItems.map((product, i) => (
          <div key={`${product.id}-${i}`} className="product-slide">
            <ProductCard data={product} />
          </div>
        ))}
      </Slider>

      <div className="feature-btn">
        <button>View All</button>
      </div>
    </div>
  );
};

export default FeatureProducts;