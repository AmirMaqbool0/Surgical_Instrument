import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchInstrumentCategories } from "../../redux/instrumentCategorySlice";
import { fetchBundles } from "../../redux/bundleSlice";
import { fetchAllProductsWithoutCategory } from "../../redux/categoryProductSlice";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useNavigate } from "react-router-dom";
import "./style.css";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  
  // Get search parameters
  const searchType = searchParams.get("type");
  const searchQuery = searchParams.get("query");
  
  // Redux state
  const { categories, loading: categoriesLoading } = useSelector((state) => state.instrumentCategory);
  const { products, loading: productsLoading } = useSelector((state) => state.categoryProduct);
  const { bundles, loading: bundlesLoading } = useSelector((state) => state.bundle);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchInstrumentCategories());
    dispatch(fetchBundles());
    // Fetch all products for search functionality
    dispatch(fetchAllProductsWithoutCategory());
  }, [dispatch]);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    // Check if data is still loading
    if (categoriesLoading || productsLoading || bundlesLoading) {
      return;
    }
    
    setLoading(true);
    
    // Perform search based on type
    let searchResults = [];
    
    try {
      switch (searchType) {
        case "products":
          searchResults = (products || []).filter(product => 
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;
          
        case "categories":
          searchResults = (categories || []).filter(category => 
            category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;
          
        case "bundles":
          searchResults = (bundles || []).filter(bundle => 
            bundle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bundle.short_desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bundle.long_desc?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          break;
          
        default:
          // Search across all types
          const productResults = (products || []).filter(product => 
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          const categoryResults = (categories || []).filter(category => 
            category.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          const bundleResults = (bundles || []).filter(bundle => 
            bundle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bundle.short_desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bundle.long_desc?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          searchResults = [
            ...productResults.map(item => ({ ...item, type: 'product' })),
            ...categoryResults.map(item => ({ ...item, type: 'category' })),
            ...bundleResults.map(item => ({ ...item, type: 'bundle' }))
          ];
      }
      
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchType, searchQuery, products, categories, bundles, categoriesLoading, productsLoading, bundlesLoading]);

  const renderResultItem = (item, index) => {
    const isProduct = item.type === 'product' || searchType === 'products';
    const isCategory = item.type === 'category' || searchType === 'categories';
    const isBundle = item.type === 'bundle' || searchType === 'bundles';
    
    // For products, use the ProductCard component
    if (isProduct) {
      return <ProductCard data={item} key={index} />;
    }
    
    // For categories, create a clickable category card
    if (isCategory) {
      return (
        <div 
          key={index} 
          className="search-category-card"
          onClick={() => navigate(`/categories?category=${item.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <div className="category-card-img">
            <img 
              src={item.image || "https://via.placeholder.com/100x100?text=Category"} 
              alt={item.name || 'Category'}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100x100?text=Category";
              }}
            />
          </div>
          <div className="category-card-name">{item.name || 'Unnamed Category'}</div>
          <div className="category-card-type">Category</div>
        </div>
      );
    }
    
    // For bundles, create a bundle card (placeholder for now)
    if (isBundle) {
      return (
        <div key={index} className="search-bundle-card">
          <div className="bundle-card-img">
            <img 
              src={item.image || "https://via.placeholder.com/100x100?text=Bundle"} 
              alt={item.name || 'Bundle'}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100x100?text=Bundle";
              }}
            />
          </div>
          <div className="bundle-card-name">{item.name || 'Unnamed Bundle'}</div>
          <div className="bundle-card-type">Bundle</div>
        </div>
      );
    }
    
    // Fallback for mixed search results
    return (
      <div key={index} className="search-result-item">
        <div className="result-image">
          <img 
            src={item.image || item.images?.[0] || "/placeholder.png"} 
            alt={item.name || 'Item'}
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>
        <div className="result-content">
          <h3 className="result-title">{item.name || 'Unnamed Item'}</h3>
          <div className="result-meta">
            <span className="result-type">
              {isProduct && "Product"}
              {isCategory && "Category"}
              {isBundle && "Bundle"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading || categoriesLoading || productsLoading || bundlesLoading) {
    return (
      <div className="search-results-container">
        <div className="search-header">
          <h1>Searching...</h1>
        </div>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Search Results</h1>
        <p>
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}" 
          {searchType !== 'all' && ` in ${searchType}`}
        </p>
      </div>
      
      {results.length === 0 ? (
        <div className="no-results">
          <h2>No results found</h2>
          <p>Try adjusting your search terms or browse our categories.</p>
        </div>
      ) : (
        <div className={`search-results-grid ${searchType === 'products' ? 'products-grid' : searchType === 'categories' ? 'categories-grid' : 'mixed-grid'}`}>
          {results.map((item, index) => renderResultItem(item, index))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 