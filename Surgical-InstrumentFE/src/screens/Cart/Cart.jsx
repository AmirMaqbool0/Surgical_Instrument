import React from 'react';
import './style.css';
import { GetinTouch, PageBanner } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  removeFromCart, 
  incrementQty, 
  decrementQty, 
  removeProductFromBundle 
} from '../../redux/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [expandedBundles, setExpandedBundles] = React.useState({});

  // Cart item handlers
  const handleRemove = (id) => dispatch(removeFromCart(id));
  const handleIncrement = (id) => dispatch(incrementQty(id));
  const handleDecrement = (id) => dispatch(decrementQty(id));

  const toggleBundle = (bundleId) => {
    setExpandedBundles(prev => ({
      ...prev,
      [bundleId]: !prev[bundleId]
    }));
  };

  const handleRemoveFromBundle = (bundleId, productId) => {
    dispatch(removeProductFromBundle({ bundleId, productId }));
  };

  // Checkout handler
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    navigate('/checkout');
  };

  // Calculate cart totals with safe number handling
  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return acc + (price * quantity);
  }, 0);

  const shipping = 100;
  const vat = subtotal * 0.1;
  const total = subtotal + shipping + vat;

  // Price formatting helper
  const formatPrice = (price) => {
    return (Number(price) || 0).toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className='cart-container'>
      <PageBanner />
      <div className="cart-content">
        <div className="cart-content-left">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Start shopping to add items to your cart</p>
              </div>
            ) : (
              cartItems.map((item) => (
                item.isBundle ? (
                  <div className="bundle-item" key={`bundle-${item.id}`}>
                    <div className="bundle-header">
                      <div className="bundle-info">
                        <h3>{item.name}</h3>
                        <span className="bundle-quantity">Quantity: {item.quantity}</span>
                      </div>
                      <div className="bundle-actions">
                        <div className="bundle-price">
                          ${formatPrice(item.price * item.quantity)}
                        </div>
                        <button
                          className="toggle-bundle-btn"
                          onClick={() => toggleBundle(item.id)}
                        >
                          {expandedBundles[item.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        <button
                          className="remove-bundle-btn"
                          onClick={() => handleRemove(item.id)}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    {expandedBundles[item.id] && (
                      <div className="bundle-products">
                        {item.products.map((product) => (
                          <div className="bundle-product-item" key={`bundle-product-${product.id}`}>
                            <div className="bundle-product-image">
                              <img src={product.image || ''} alt={product.name} />
                            </div>
                            <div className="bundle-product-details">
                              <span className="bundle-product-name">{product.name}</span>
                              <span className="bundle-product-price">
                                ${formatPrice(product.price)}
                              </span>
                            </div>
                            <button 
                              className="remove-from-bundle-btn"
                              onClick={() => handleRemoveFromBundle(item.id, product.id)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <div className="bundle-total">
                          <span>Bundle Total:</span>
                          <span>
                            ${formatPrice(item.price)} × {item.quantity} = 
                            ${formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="cart-item" key={`product-${item.id}`}>
                    <div className="cart-remove" onClick={() => handleRemove(item.id)}>
                      <X color='black' size={30} />
                    </div>
                    <div className="cart-image">
                      <img src={item.image || ''} alt={item.name} />
                    </div>
                    <div className="cart-name">
                      <span>{item.name || 'Product'}</span>
                    </div>
                    <div className="cart-price">
                      <span>${formatPrice(item.price)}</span>
                    </div>
                    <div className="cart-quantity">
                      <span onClick={() => handleDecrement(item.id)}>-</span>
                      <h1>{item.quantity}</h1>
                      <span onClick={() => handleIncrement(item.id)} className='left'>+</span>
                    </div>
                    <div className="cart-total">
                      <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-left-bottom">
              <div className="cart-bottom-coupon">
                <input 
                  type="text" 
                  placeholder='Coupon Code' 
                  className="coupon-input"
                />
                <button className="apply-coupon-btn">Apply Coupon</button>
              </div>
              <div className="cart-btn">
                <button 
                  className="update-cart-btn"
                  onClick={() => window.location.reload()} // Or implement actual update logic
                >
                  Update Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-content-right">
            <div className="cart-total-container">
              <h3>Cart Totals</h3>
              <div className="cart-total-details">
                <div className="cart-total-row">
                  <span>Cart Subtotal</span>
                  <span>${formatPrice(subtotal)}</span>
                </div>
                <div className="cart-total-row">
                  <span>Shipping and Handling</span>
                  <span>${formatPrice(shipping)}</span>
                </div>
                <div className="cart-total-row">
                  <span>VAT (10%)</span>
                  <span>${formatPrice(vat)}</span>
                </div>
                <div className="cart-total-row total">
                  <span><strong>Order Total</strong></span>
                  <span><strong>${formatPrice(total)}</strong></span>
                </div>
              </div>
              <button 
                className="checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <GetinTouch />
    </div>
  );
};

export default Cart;