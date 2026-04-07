import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { ChevronLeft, ChevronRight, Home, Star } from "lucide-react";
import { AddReview, GetinTouch, ProductCard } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../redux/singleProductSlice";
import { Link, useParams } from "react-router-dom";
import { addToCart } from "../../redux/cartSlice";
import { fetchRelatedProducts } from "../../redux/relatedProductsSlice";
import { FaThumbsUp, FaReply, FaStar } from "react-icons/fa";

// Skeleton Loading Components
const ProductDetailSkeleton = () => {
  return (
    <div className="instrument-detail">
      <div className="instrument-detail-left">
        <div
          className="detail-pic skeleton-animation"
          style={{ backgroundColor: "#f0f0f0" }}
        ></div>
        <div className="detail-left-images">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="detail-left-img skeleton-animation"
              style={{ backgroundColor: "#f0f0f0" }}
            ></div>
          ))}
        </div>
      </div>
      <div className="instrument-detail-right">
        <div className="detail-right-header">
          <div
            className="skeleton-animation"
            style={{ width: "70%", height: "30px", backgroundColor: "#f0f0f0" }}
          ></div>
          <div
            className="right-header-btn skeleton-animation"
            style={{ backgroundColor: "#f0f0f0" }}
          ></div>
        </div>
        <div
          className="skeleton-animation"
          style={{
            width: "100px",
            height: "25px",
            backgroundColor: "#f0f0f0",
            margin: "20px 0",
          }}
        ></div>
        <div className="instrument-ratings">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div
                key={i}
                className="skeleton-animation"
                style={{
                  width: "18px",
                  height: "18px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "50%",
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="instrument-detail-type">
          {[1, 2].map((_, i) => (
            <div key={i} className="detail-type-point">
              <div
                className="skeleton-animation"
                style={{
                  width: "120px",
                  height: "20px",
                  backgroundColor: "#f0f0f0",
                }}
              ></div>
              <div
                className="skeleton-animation"
                style={{
                  width: "150px",
                  height: "20px",
                  backgroundColor: "#f0f0f0",
                  marginLeft: "10px",
                }}
              ></div>
            </div>
          ))}
        </div>
        <div className="instrument-quantity">
          <div
            className="skeleton-animation"
            style={{
              width: "100px",
              height: "25px",
              backgroundColor: "#f0f0f0",
            }}
          ></div>
          <div className="instrument-quantity-box">
            <div
              className="skeleton-animation"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#f0f0f0",
              }}
            ></div>
            <div
              className="skeleton-animation"
              style={{
                width: "50px",
                height: "25px",
                backgroundColor: "#f0f0f0",
              }}
            ></div>
            <div
              className="skeleton-animation"
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "#f0f0f0",
              }}
            ></div>
          </div>
        </div>
        <div className="instrument-detail-btns">
          <div
            className="skeleton-animation"
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
            }}
          ></div>
          <div
            className="skeleton-animation"
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const RelatedProductsSkeleton = () => {
  return (
    <div className="related-products">
      <div className="related-products-header">
        <div
          className="skeleton-animation"
          style={{ width: "200px", height: "30px", backgroundColor: "#f0f0f0" }}
        ></div>
        <div className="related-products-btns">
          <div
            className="detai-left-btn skeleton-animation"
            style={{ backgroundColor: "#f0f0f0" }}
          ></div>
          <div
            className="detail-right-btn skeleton-animation"
            style={{ backgroundColor: "#f0f0f0" }}
          ></div>
        </div>
      </div>
      <div className="related-products-products">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="related-products-product">
            <div
              className="skeleton-animation"
              style={{
                width: "100%",
                height: "250px",
                backgroundColor: "#f0f0f0",
                borderRadius: "12px",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstrumentDetail = () => {
  const [mainImg, setMainImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth - 20,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth + 20,
        behavior: "smooth",
      });
    }
  };

  const prevImg = () => {
    const images = product?.images || [];
    if (mainImg === 0) {
      setMainImg(images.length - 1);
    } else {
      setMainImg(mainImg - 1);
    }
  };

  const nextImg = () => {
    const images = product?.images || [];
    if (mainImg === images.length - 1) {
      setMainImg(0);
    } else {
      setMainImg(mainImg + 1);
    }
  };

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.singleProduct
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    const productToAdd = {
      id: product?._id,
      name: product?.name,
      price: product?.price,
      quantity,
      image: product?.images?.[0] || '',
    };

    dispatch(addToCart(productToAdd));
  };

  const { products, loading2, error2 } = useSelector(
    (state) => state.relatedProducts
  );

  useEffect(() => {
    if (product?.category_id?.id && product?.manufacturer_id?.id) {
      dispatch(
        fetchRelatedProducts({
          category_id: product?.category_id?.id,
          manufacturer_id: product?.manufacturer_id?.id,
        })
      );
    }
  }, [product?.category_id?.id, product?.manufacturer_id?.id, dispatch]);

  // Rating data - using actual product data when available
  const averageRating = product?.average_rating || 4.8;
  const totalReviews = product?.total_reviews || 0;
  const ratings = [
    { stars: 5, percentage: product?.rating_5_percentage || 70 },
    { stars: 4, percentage: product?.rating_4_percentage || 15 },
    { stars: 3, percentage: product?.rating_3_percentage || 10 },
    { stars: 2, percentage: product?.rating_2_percentage || 3 },
    { stars: 1, percentage: product?.rating_1_percentage || 2 },
  ];

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [activeTab]);

  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  // Get product images or use placeholder
  const productImages = product?.images || [];
  const hasImages = productImages.length > 0;
  const dummyImage = 'https://alispo.com.pk/wp-content/uploads/2023/05/152552-1.webp';

  return (
    <div className="instrument-detail-main-container">
      <div className="instrument-detail-container">
        <div className="instrument-detail-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Home />
          </Link>
          <span>Home</span>
          <ChevronRight />
          {loading ? (
            <div
              className="skeleton-animation"
              style={{
                width: "100px",
                height: "16px",
                backgroundColor: "#f0f0f0",
              }}
            ></div>
          ) : (
            <span>{product?.manufacturer_id?.name || "Manufacturer not available"}</span>
          )}
          <ChevronRight />
          {loading ? (
            <div
              className="skeleton-animation"
              style={{
                width: "150px",
                height: "16px",
                backgroundColor: "#f0f0f0",
              }}
            ></div>
          ) : (
            <p>{product?.name || "Product name not available"}</p>
          )}
        </div>

        {loading ? (
          <ProductDetailSkeleton />
        ) : (
          <div className="instrument-detail">
            <div className="instrument-detail-left">
              <div className="detail-pic">
                <img 
                  src={hasImages ? productImages[mainImg] : dummyImage} 
                  alt={product?.name || "Product Image"} 
                />
                {hasImages && productImages.length > 1 && (
                  <div className="detail-carousel-btn">
                    <div className="detai-left-btn" onClick={prevImg}>
                      <ChevronLeft color="white" />
                    </div>
                    <div className="detail-right-btn" onClick={nextImg}>
                      <ChevronRight color="white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="detail-left-images">
                {hasImages ? (
                  productImages.map((img, i) => (
                    <div
                      className={`detail-left-img ${
                        mainImg === i ? "active-img" : ""
                      }`}
                      onClick={() => setMainImg(i)}
                      key={i}
                    >
                      <img src={img} alt={`${product?.name || 'Product'} ${i + 1}`} />
                    </div>
                  ))
                ) : (
                  <div className="detail-left-img active-img">
                    <img src={dummyImage} alt="Product placeholder" />
                  </div>
                )}
              </div>
            </div>
            <div className="instrument-detail-right">
              <div className="detail-right-header">
                <span>{product?.name || "Product name not available"}</span>
                <div className="right-header-btn">
                  <span>{product?.quantity > 0 ? "In Stock" : "Out of Stock"}</span>
                </div>
              </div>
              <div className="instrument-detail-price">
                <span>${product?.price || "Price not available"}</span>
              </div>
              <div className="instrument-ratings">
                <div className="rating-stars">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <Star 
                        key={i} 
                        color="#FFCF24" 
                        fill={i < Math.floor(averageRating) ? "#FFCF24" : "none"} 
                        size={18} 
                      />
                    ))}
                  <span>{averageRating}</span>
                </div>
                <div className="line"></div>
                <span>{totalReviews} Reviews</span>
                <div className="line"></div>
                <span>{product?.sold || 0} Sold</span>
              </div>
              <div className="instrument-detail-type">
                <div className="detail-type-point">
                  <span>Part Number:</span>
                  <p>{product?.product_number || "Part number not available"}</p>
                </div>
                <div className="detail-type-point">
                  <span>Family:</span>
                  <p>{product?.short_desc || "Family information not available"}</p>
                </div>
              </div>
              <div className="instrument-quantity">
                <span>Quantity</span>
                <div className="instrument-quantity-box">
                  <span onClick={decreaseQty}>-</span>
                  <div className="quantity-box">
                    <span>{quantity}</span>
                  </div>
                  <span onClick={increaseQty}>+</span>
                </div>
              </div>
              <div className="instrument-detail-btns">
                <button onClick={handleAddToCart}>Add to cart</button>
                <button className="btn2">Checkout</button>
              </div>
            </div>
          </div>
        )}
        <div className="product-detail-tabs">
          <div className="product-detail-tab">
            <span
              onClick={() => setActiveTab("description")}
              className={`${activeTab === "description" ? "active-tab" : ""}`}
            >
              Description
            </span>
            <span
              onClick={() => setActiveTab("review")}
              className={`${activeTab === "review" ? "active-tab" : ""}`}
            >
              Reviews
            </span>
          </div>

          <div className="product-tabs-content">
            {activeTab === "description" ? (
              <div className="product-description">
                <span>Product Description</span>
                <p>
                  {product?.long_desc || "Product description is not available at the moment. Please contact our support team for more information about this product."}
                </p>
              </div>
            ) : (
              <div className="review-content">
                <div className="review-heading">
                  <span>Customers Feedback</span>
                </div>
                <div className="customers-feedback" ref={sectionRef}>
                  <div className="feedback-left">
                    <div className="rating-number">{averageRating}</div>
                    <div className="stars">★★★★★</div>
                    <div className="rating-label">Product Rating</div>
                  </div>
                  <div className="feedback-right">
                    {ratings.map((item, index) => (
                      <div key={index} className="rating-bar-row">
                        <div className="bar-stars">
                          {"★".repeat(item.stars)}
                        </div>
                        <div className="bar-track">
                          <div
                            className={`bar-fill ${visible ? "animate" : ""}`}
                            style={{
                              width: visible ? `${item.percentage}%` : "0%",
                            }}
                          ></div>
                        </div>
                        <div className="bar-percent">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reviews-container">
                  <h1>Reviews</h1>
                  {product?.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div className="review-card" key={index}>
                        <div className="review-header">
                          <div className="avatar">
                            {review.user_name ? review.user_name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="review-info">
                            <div className="review-name-time">
                              <span className="name">{review.user_name || "Anonymous User"}</span>
                              <span className="time">
                                {review.created_at ? new Date(review.created_at).toLocaleDateString() : "Date not available"}
                              </span>
                            </div>
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className="star-icon" 
                                  style={{ color: i < (review.rating || 5) ? "#FFCF24" : "#ddd" }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="review-body">
                          <h4>{review.title || "Review"}</h4>
                          <p>{review.comment || "No comment provided"}</p>
                        </div>
                        <div className="review-actions">
                          <span className="like-btn">
                            <FaThumbsUp /> Like
                          </span>
                          <span className="reply-btn">
                            <FaReply /> Reply
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews available for this product yet. Be the first to leave a review!</p>
                    </div>
                  )}
                </div>
                <AddReview productId={product?._id}/>
              </div>
            )}
          </div>
        </div>
        {loading2 ? (
          <RelatedProductsSkeleton />
        ) : (
          <div className="related-products">
            <div className="related-products-header">
              <span>Related Instruments</span>
              <div className="related-products-btns">
                <div className="detai-left-btn" onClick={scrollLeft}>
                  <ChevronLeft color="white" />
                </div>
                <div className="detail-right-btn" onClick={scrollRight}>
                  <ChevronRight color="white" />
                </div>
              </div>
            </div>
            <div className="related-products-products" ref={carouselRef}>
              {products && products.length > 0 ? (
                products.map((product, i) => (
                  <div className="related-products-product" key={i}>
                                            <ProductCard data={product} />
                  </div>
                ))
              ) : (
                <div className="no-related-products">
                  <p>No related products available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <GetinTouch />
    </div>
  );
};

export default InstrumentDetail;
