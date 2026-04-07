import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import { GetinTouch, PageBanner } from "../../components";
import { Dot, Loader2, Search, ChevronDown, X } from "lucide-react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { addBundleToCart } from "../../redux/cartSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { debounce } from "lodash";
import Intrument from "../../assets/instrument.png";
import { Link, useNavigate } from "react-router-dom";
import { fetchBundles } from "../../redux/bundleSlice";

const PredefineBundel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bundles, loading, error } = useSelector((state) => state.bundle);
  console.log(bundles)
  useEffect(() => {
    dispatch(fetchBundles());
  }, [dispatch]);

  const filteredBundles = bundles.filter((bundle) => {
    const matchesSearch = bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bundle.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = (
      (!priceRange.min || bundle.price >= Number(priceRange.min)) && 
      (!priceRange.max || bundle.price <= Number(priceRange.max))
    );
    
    return matchesSearch && matchesPrice;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredBundles.length / itemsPerPage);
  const paginatedBundles = filteredBundles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (bundle) => {
    if (!bundle.items || bundle.items.length === 0) {
      console.error("Cannot add empty bundle to cart");
      return;
    }

    dispatch(addBundleToCart({
      items: bundle.items,
      bundleName: bundle.name,
      bundleQuantity: 1,
      price: bundle.price,
      image: bundle.image,
      description: bundle.description
    }));
    navigate("/cart");
  };

  const handleSearch = debounce((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, 300);

  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading bundles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading bundles</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="bundels-container">
      <PageBanner  title={'Predefine Bundles'}/>
      <div className="bundels-content">
        <div className="bundels-heading">
          <span>Surgical Instruments Bundles</span>
          <p>
            Browse our pre-defined surgical instrument bundles, carefully curated
            for specific procedures and offering cost savings over individual purchases.
          </p>
        </div>

        <div className="instruments-content-container bandle-content-container">
          <div className="instruments-header">
            <h2>Bundles</h2>
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search bundles..."
                className="search-bar"
                onChange={handleSearch}
                defaultValue={searchTerm}
              />
            </div>
          </div>

          <div className="instruments-body">
            <div className="filter-sidebar">
              <div className="filter-header">
                <h3>Filters</h3>
                {(searchTerm || priceRange.min || priceRange.max) && (
                  <button onClick={clearFilters} className="clear-filters">
                    Clear all
                  </button>
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
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(e, "min")}
                      min="0"
                    />
                  </div>
                  <div className="input-group">
                    <label>Max Price</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(e, "max")}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="bundle-info">
                <h3>About Our Bundles</h3>
                <p>
                  Our bundles combine essential instruments for specific procedures
                  at discounted prices. Each instrument meets our high quality standards.
                </p>
              </div>
            </div>

            <div className="products-container">
              {filteredBundles.length === 0 ? (
                <div className="no-products">
                  <p>No bundles match your search criteria.</p>
                  <button onClick={clearFilters}>Clear all filters</button>
                </div>
              ) : (
                <>
                  <div className="products-grid">
                    {paginatedBundles.map((bundle) => (
                      <div key={bundle._id} className="instrument-card">
                        <div className="instruments-card-header">
                          <div className="stock">
                            <span>In stock</span>
                          </div>
                          <div className="instument-header-point">
                            <Dot color="gray" />
                            <span>{bundle.productNumber || "BUNDLE"}</span>
                          </div>
                        </div>
                        <div className="instrument-card-logo">
                          <img
                            src={bundle.image || Intrument}
                            alt={bundle.name}
                          />
                        </div>
                        <div className="instrument-card-detail">
                          <div className="instrument-card-text">
                            <span>{bundle.name}</span>
                            <p>${bundle.price}</p>
                            <p className="bundle-description">
                              {bundle.description}...
                            </p>
                          </div>
                          <div className="instrument-card-btn">
                            <button onClick={() => handleAddToCart(bundle)}>
                              Add to Cart
                            </button>
                          </div>
                          <div className="instrument-card-btn2">
                         <Link to={`/bundeldetail/${bundle._id}`}>   <button>View details</button> </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="pagination-button"
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`pagination-number ${
                              currentPage === page ? "active" : ""
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <GetinTouch />
    </div>
  );
};

export default PredefineBundel;