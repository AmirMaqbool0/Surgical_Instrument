import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { ChevronLeft, ChevronRight, Home, Star } from "lucide-react";
import Instrument from "../../assets/instrument.png";
import Instrument2 from "../../assets/image.png";
import { AddReview, GetinTouch } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addBundleToCart } from "../../redux/cartSlice";
import { FaThumbsUp, FaReply, FaStar } from "react-icons/fa";
import { fetchSingleBundle } from "../../redux/singleBundleSlice";

// Skeleton Loading Components
const ProductDetailSkeleton = () => {
  return (
    <div className="instrument-detail">
      <div className="instrument-detail-left">
        <div className="detail-pic skeleton-animation" style={{ backgroundColor: "#f0f0f0" }}></div>
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
          <div className="skeleton-animation" style={{ width: "70%", height: "30px", backgroundColor: "#f0f0f0" }}></div>
          <div className="right-header-btn skeleton-animation" style={{ backgroundColor: "#f0f0f0" }}></div>
        </div>
        <div className="skeleton-animation" style={{ width: "100px", height: "25px", backgroundColor: "#f0f0f0", margin: "20px 0" }}></div>
        <div className="instrument-ratings">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div
                key={i}
                className="skeleton-animation"
                style={{ width: "18px", height: "18px", backgroundColor: "#f0f0f0", borderRadius: "50%" }}
              ></div>
            ))}
          </div>
        </div>
        <div className="instrument-detail-type">
          {[1, 2].map((_, i) => (
            <div key={i} className="detail-type-point">
              <div className="skeleton-animation" style={{ width: "120px", height: "20px", backgroundColor: "#f0f0f0" }}></div>
              <div className="skeleton-animation" style={{ width: "150px", height: "20px", backgroundColor: "#f0f0f0", marginLeft: "10px" }}></div>
            </div>
          ))}
        </div>
        <div className="instrument-quantity">
          <div className="skeleton-animation" style={{ width: "100px", height: "25px", backgroundColor: "#f0f0f0" }}></div>
          <div className="instrument-quantity-box">
            <div className="skeleton-animation" style={{ width: "30px", height: "30px", backgroundColor: "#f0f0f0" }}></div>
            <div className="skeleton-animation" style={{ width: "50px", height: "25px", backgroundColor: "#f0f0f0" }}></div>
            <div className="skeleton-animation" style={{ width: "30px", height: "30px", backgroundColor: "#f0f0f0" }}></div>
          </div>
        </div>
        <div className="instrument-detail-btns">
          <div className="skeleton-animation" style={{ width: "100%", height: "40px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}></div>
          <div className="skeleton-animation" style={{ width: "100%", height: "40px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}></div>
        </div>
      </div>
    </div>
  );
};

const BundelDetail = () => {
  const [mainImg, setMainImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [liked, setLiked] = useState(false);
  const [visible, setVisible] = useState(false);
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const dispatch = useDispatch();
  const { bundle, status, error } = useSelector((state) => state.singleBundle);
  
  const Images = [Instrument, Instrument2, Instrument, Instrument2];
  const ratings = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleBundle(id));
    }
  }, [dispatch, id]);

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

  const handleAddToCart = () => {
    if (!bundle?.data) {
      console.error("No bundle data available");
      return;
    }

    // Match the exact structure used in PredefineBundel
    const bundleToAdd = {
      items: bundle.data.items || bundle.data.products || [],
      bundleName: bundle.data.name,
      bundleQuantity: quantity,
      price: bundle.data.price,
      image: Images[0],
      description: bundle.data.short_desc || bundle.data.description || ""
    };

    console.log("Adding bundle to cart:", bundleToAdd);
    dispatch(addBundleToCart(bundleToAdd));
    navigate("/cart");
  };

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

  const toggleLike = () => setLiked(!liked);

  if (status === "loading") {
    return (
      <div className="instrument-detail-main-container">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="error-message">
        Error loading bundle: {error?.message || "Unknown error"}
      </div>
    );
  }

  if (!bundle?.data) {
    return <div className="error-message">No bundle data found</div>;
  }

  return (
    <div className="instrument-detail-main-container">
      <div className="instrument-detail-container">
        <div className="instrument-detail-header">
          <Home /> <span>Home</span> <ChevronRight />{" "}
          <span>{bundle.data.name}</span>
        </div>

        <div className="instrument-detail">
          <div className="instrument-detail-left">
            <div className="detail-pic">
              <img src={Images[mainImg]} alt={bundle.data.name} />
              <div className="detail-carousel-btn">
                <div 
                  className="detai-left-btn" 
                  onClick={() => setMainImg(prev => (prev === 0 ? Images.length - 1 : prev - 1))}
                >
                  <ChevronLeft color="white" />
                </div>
                <div 
                  className="detail-right-btn" 
                  onClick={() => setMainImg(prev => (prev === Images.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight color="white" />
                </div>
              </div>
            </div>
            <div className="detail-left-images">
              {Images.map((img, i) => (
                <div
                  className={`detail-left-img ${mainImg === i ? "active-img" : ""}`}
                  onClick={() => setMainImg(i)}
                  key={i}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="instrument-detail-right">
            <div className="detail-right-header">
              <span>{bundle.data.name}</span>
              <div className="right-header-btn">
                <span>in stock</span>
              </div>
            </div>
            <div className="instrument-detail-price">
              <span>${bundle.data.price}</span>
            </div>
            <div className="instrument-ratings">
              <div className="rating-stars">
                {Array(5).fill().map((_, i) => (
                  <Star key={i} color="#FFCF24" fill="#FFCF24" size={18} />
                ))}
                <span>5</span>
              </div>
              <div className="line"></div>
              <span>{bundle.data.review || 0} Reviews</span>
              <div className="line"></div>
              <span>{bundle.data.display_order || 0} Sold</span>
            </div>
            <div className="instrument-detail-type">
              <div className="detail-type-point">
                <span>Part Number:</span>
                <p>{bundle.data.product_number || "NA"}</p>
              </div>
              <div className="detail-type-point">
                <span>Description:</span>
                <p>{bundle.data.short_desc || "NA"}</p>
              </div>
            </div>
            <div className="instrument-quantity">
              <span>Quantity</span>
              <div className="instrument-quantity-box">
                <span onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</span>
                <div className="quantity-box">
                  <span>{quantity}</span>
                </div>
                <span onClick={() => setQuantity(prev => prev + 1)}>+</span>
              </div>
            </div>
            <div className="instrument-detail-btns">
              <button onClick={handleAddToCart}>Add to cart</button>
              <button className="btn2">Checkout</button>
            </div>
          </div>
        </div>

        <div className="product-detail-tabs">
          <div className="product-detail-tab">
            <span
              onClick={() => setActiveTab("description")}
              className={activeTab === "description" ? "active-tab" : ""}
            >
              Description
            </span>
            <span
              onClick={() => setActiveTab("review")}
              className={activeTab === "review" ? "active-tab" : ""}
            >
              Reviews
            </span>
          </div>

          <div className="product-tabs-content">
            {activeTab === "description" ? (
              <div className="product-description">
                <span>Product Description</span>
                <p>{bundle.data.long_desc || "No description available"}</p>
              </div>
            ) : (
              <div className="review-content">
                <div className="review-heading">
                  <span>Customers Feedback</span>
                </div>
                <div className="customers-feedback" ref={sectionRef}>
                  <div className="feedback-left">
                    <div className="rating-number">4.8</div>
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
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="bar-percent">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reviews-container">
                  <h1>Reviews</h1>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="avatar">A.T</div>
                      <div className="review-info">
                        <div className="review-name-time">
                          <span className="name">Nicolas Cage</span>
                          <span className="time">3 Days ago</span>
                        </div>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="star-icon" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="review-body">
                      <h4>Great Product</h4>
                      <p>
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, by injected humour.
                      </p>
                    </div>
                    <div className="review-actions">
                      <span
                        className={`like-btn ${liked ? "liked" : ""}`}
                        onClick={toggleLike}
                      >
                        <FaThumbsUp /> Like
                      </span>
                      <span className="reply-btn">
                        <FaReply /> Reply
                      </span>
                    </div>
                  </div>
                </div>
                <AddReview productId={bundle.data.id} />
              </div>
            )}
          </div>
        </div>
      </div>
      <GetinTouch />
    </div>
  );
};

export default BundelDetail;