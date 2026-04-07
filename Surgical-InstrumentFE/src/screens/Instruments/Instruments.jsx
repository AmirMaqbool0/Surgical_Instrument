import React, { useEffect, useState } from "react";
import "./style.css";
import { GetinTouch, ProductCard, PageBanner } from "../../components";
import { Loader2, Search } from "lucide-react";
import { fetchAllProducts, fetchAllProductsWithoutCategory, fetchFilteredProducts, updateFilters, clearFilters } from "../../redux/categoryProductSlice";
import { fetchInstrumentCategories } from "../../redux/instrumentCategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { debounce } from "lodash";

const PRODUCTS_PER_PAGE = 12;

const Instruments = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get state from Redux
    const { 
        products, 
        filteredProducts, 
        loading, 
        error, 
        currentFilters, 
        hasAppliedFilters,
        isFiltering
    } = useSelector((state) => state.categoryProduct);
    
    const { categories } = useSelector((state) => state.instrumentCategory);
    const cartItems = useSelector((state) => state.cart.cartItems);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    // Determine which products to display
    const displayProducts = isFiltering ? filteredProducts : products;
    const productCount = displayProducts.length;

    // Calculate cart totals
    const cartSubtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return acc + (price * quantity);
    }, 0);

    const formatPrice = (price) => {
        return (Number(price) || 0).toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Debounced filter application
    const applyFilters = debounce(() => {
        if (hasAppliedFilters) {
            dispatch(fetchFilteredProducts({ category_id: id, filters: currentFilters }));
        } else {
            dispatch(fetchAllProducts(id));
        }
    }, 500);

    // Fetch categories on component mount
    useEffect(() => {
        dispatch(fetchInstrumentCategories());
    }, [dispatch]);

    // Handle navigation when no category ID is provided
    useEffect(() => {
        if (!id && categories && categories.length > 0) {
            // Fetch all products from all categories
            dispatch(fetchAllProductsWithoutCategory())
                .then((result) => {
                    if (result.error) {
                        console.error("Error fetching all products:", result.error);
                    }
                    setIsInitialLoad(false);
                })
                .catch((error) => {
                    console.error("Error in fetchAllProductsWithoutCategory:", error);
                    setIsInitialLoad(false);
                });
        }
    }, [id, categories, dispatch]);

    // Fetch all products on initial load and when category changes
    useEffect(() => {
        if (!id) return; // Don't fetch products if no category ID (handled above)
        
        const fetchData = async () => {
            try {
                await dispatch(fetchAllProducts(id));
                setIsInitialLoad(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setIsInitialLoad(false);
            }
        };

        fetchData();
    }, [dispatch, id]);

    // Apply filters when they change
    useEffect(() => {
        if (!isInitialLoad) {
            applyFilters();
        }
        return () => applyFilters.cancel();
    }, [currentFilters, isInitialLoad]);

    // Reset initial load when id changes
    useEffect(() => {
        setIsInitialLoad(true);
        dispatch(clearFilters());
        setCurrentPage(1);
    }, [id, dispatch]);

    const handleRangeFilter = (filterType, value) => {
        dispatch(updateFilters({ [filterType]: value }));
    };

    const handleSearchChange = (e) => {
        dispatch(updateFilters({ search: e.target.value }));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(displayProducts.length / PRODUCTS_PER_PAGE)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Show loading while fetching categories or if no categories loaded yet
    if (!id && (!categories || categories.length === 0)) {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading categories...</p>
            </div>
        );
    }

    if (isInitialLoad) {
        return (
            <div className="loading-container">
                <Loader2 className="animate-spin" size={48} />
                <p>Loading instruments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error loading products</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    const paginatedProducts = displayProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
    const totalPages = Math.ceil(displayProducts.length / PRODUCTS_PER_PAGE);

    return (
        <div className="categories-page-container">
            {/* Banner */}
            <div className="categories-banner">
                <div className="categories-breadcrumb">Home/ Instruments</div>
                <h1>All Instruments</h1>
                <p>For the most precise and delicate surgeries, high-quality instruments are crucial. Invest in instruments that are designed for superior performance, reliability, and durability</p>
                <button className="categories-banner-btn">View Categories</button>
            </div>

            {/* Description */}
            <div className="categories-description-section">
                <h2>Surgical Instruments Catalog</h2>
                <p>A reliable source for quality instrumentation crafted from German surgical stainless steel or machined from US surgical stainless steel. Quickly find the surgical instrument you need by using our instrument search or find the best match to another manufacturer's part number in our extensive cross-reference database</p>
            </div>

            {/* Main Content */}
            <div className="categories-main-content">
                {/* Sidebar with filters and cart summary */}
                <aside className="categories-sidebar">
                    <div className="filter-sidebar">
                        <div className="filter-header">
                            <h3>Filters</h3>
                            {hasAppliedFilters && (
                                <button onClick={handleClearFilters} className="clear-filters">Clear all</button>
                            )}
                        </div>

                        <div className="filter-group">
                            <h3>Price Range</h3>
                            <div className="filter-inputs">
                                <div className="input-group">
                                    <label>Min Price</label>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={currentFilters.min_price}
                                        onChange={(e) => handleRangeFilter("min_price", e.target.value)}
                                        min="0"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Max Price</label>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={currentFilters.max_price}
                                        onChange={(e) => handleRangeFilter("max_price", e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h3>Quantity Range</h3>
                            <div className="filter-inputs">
                                <div className="input-group">
                                    <label>Min Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={currentFilters.min_quantity}
                                        onChange={(e) => handleRangeFilter("min_quantity", e.target.value)}
                                        min="0"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Max Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={currentFilters.max_quantity}
                                        onChange={(e) => handleRangeFilter("max_quantity", e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h3>Cart Summary</h3>
                        {cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <>
                                <div>
                                    {cartItems.slice(0, 3).map((item, index) => (
                                        <div key={item.id} className="cart-item-preview">
                                            <div className="cart-item-info">
                                                <div className="cart-item-name">
                                                    {item.name?.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                                                </div>
                                                <div className="cart-item-qty">
                                                    Qty: {item.quantity}
                                                </div>
                                            </div>
                                            <div className="cart-item-price">
                                                ${formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                    {cartItems.length > 3 && (
                                        <div className="cart-more-items">
                                            +{cartItems.length - 3} more items
                                        </div>
                                    )}
                                </div>
                                <div className="cart-subtotal">
                                    <span className="cart-subtotal-label">Subtotal:</span>
                                    <span className="cart-subtotal-value">
                                        ${formatPrice(cartSubtotal)}
                                    </span>
                                </div>
                                <div className="cart-actions">
                                    <Link to="/cart" className="cart-btn cart-btn-primary">
                                        View Cart ({cartItems.length})
                                    </Link>
                                    <Link to="/checkout" className="cart-btn cart-btn-secondary">
                                        Checkout
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="categories-content">
                    <div className="categories-content-header">
                        <h2>Instruments</h2>
                        <div className="categories-search-bar">
                            <Search className="search-icon" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search instruments..." 
                                value={currentFilters.search}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="products-loading">
                            <Loader2 className="animate-spin" size={32} />
                            <p>Loading products...</p>
                        </div>
                    ) : productCount > 0 ? (
                        <>
                            <div className="results-info">
                                Showing {((currentPage - 1) * PRODUCTS_PER_PAGE) + 1} to {Math.min(currentPage * PRODUCTS_PER_PAGE, displayProducts.length)} of {displayProducts.length} instruments
                                {hasAppliedFilters && " (filtered)"}
                            </div>
                            <div className="categories-products-grid">
                                {paginatedProducts.map((product) => (
                                    <ProductCard data={product} key={product.id} />
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="pagination-button"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={`page-${page}`}
                                            onClick={() => setCurrentPage(page)}
                                            className={`pagination-number ${currentPage === page ? "active" : ""}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="pagination-button"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : hasAppliedFilters ? (
                        <div className="no-products">
                            <p>No products available matching your criteria.</p>
                            <button onClick={handleClearFilters}>Clear all filters</button>
                        </div>
                    ) : (
                        <div className="no-products">
                            <p>No products available in this category.</p>
                        </div>
                    )}
                </div>
            </div>
            <GetinTouch />
        </div>
    );
};

export default Instruments;