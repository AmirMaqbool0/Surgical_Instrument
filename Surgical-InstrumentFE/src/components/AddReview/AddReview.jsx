import React, { useState, useEffect } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { uploadReview, resetReviewState } from '../../redux/reviewSlice';

const AddReview = ({ productId }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.review);
  console.log(productId)
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    if (!rating || !title || !description) {
      alert('Please fill out all fields and select a rating.');
      return;
    }
    console.log({
        type: 'product',
        type_id: productId,
        title,
        description,
        rating,
      });
    dispatch(uploadReview({
      type_id: productId,
      title,
      description,
      rating:Number(rating)
    }));
  };

  useEffect(() => {
    if (success) {
      alert('Review submitted successfully!');
      setRating(0);
      setTitle('');
      setDescription('');
      dispatch(resetReviewState());
    }

    if (error) {
      alert('Something went wrong while submitting the review.');
    }
  }, [success, error, dispatch]);

  return (
    <div className='add-review'>
      <h1>Write a Review</h1>
      <div className="add-review-top">
        <p>What is it like to Product?</p>
        <div className="add-review-rating">
          {Array(5).fill().map((_, i) => (
            <span
              key={i}
              className={`star ${i < rating ? 'active' : ''}`}
              onClick={() => handleRating(i)}
            >
              ★
            </span>
          ))}
        </div>

        <div className="review-input">
          <span>Review Title</span>
          <input
            type="text"
            placeholder='Great Products'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="review-input">
          <span>Review Content</span>
          <textarea
            placeholder='message...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="add-review-btn" onClick={handleSubmit}>
          <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
        </div>

        {error && <p className="error-message">❌ {error.message || 'Something went wrong'}</p>}

      </div>
    </div>
  );
};

export default AddReview;
