import React from 'react'
import './style.css'
import { MoveRight, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/cartSlice'

const ProductCard = ({ data }) => {
    const dispatch = useDispatch();
    const dummyImage = 'https://alispo.com.pk/wp-content/uploads/2023/05/152552-1.webp'; 

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent the Link navigation
        e.stopPropagation(); // Stop event bubbling
        
        dispatch(addToCart({
            id: data._id,
            name: data.name,
            price: data.price,
            image: data.images?.[0] || dummyImage,
            product_number: data.product_number,
            quantity: 1
        }));
    };

    return (
        <Link to={`/instrumentdetail/${data?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className='product-card'>
                <div className="product-card-img">
                    <img 
                        src={data?.images?.[0] || dummyImage} 
                        alt={data?.name || "Product Image"} 
                    />
                </div>
                <div className="product-card-detail">
                    <div className="product-detail-no">
                        <span>{data?.product_number}</span>
                    </div>
                    <span>{data?.name}</span>
                    <div className="product-card-actions">
                        <div className="product-detail-btn">
                            <span>View Details</span>
                            <MoveRight color='rgba(0, 180, 130, 1)' />
                        </div>
                        <button 
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                            title="Add to Cart"
                        >
                            <ShoppingCart size={16} />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard;
