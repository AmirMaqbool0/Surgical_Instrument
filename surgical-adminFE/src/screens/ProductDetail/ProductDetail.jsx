import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import Modal from 'react-modal';
import './style.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Allowed currencies for manufacturer
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY"];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [modalMsg, setModalMsg] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  // Dropdown data for edit modal
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturersLoading, setManufacturersLoading] = useState(false);
  const [manufacturersError, setManufacturersError] = useState("");
  // Modal state for add new
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  // Category modal fields
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [categoryModalError, setCategoryModalError] = useState("");
  const [categoryModalLoading, setCategoryModalLoading] = useState(false);
  // Manufacturer modal fields
  const [newManName, setNewManName] = useState("");
  const [newManDesc, setNewManDesc] = useState("");
  const [newManLogo, setNewManLogo] = useState(null);
  const [newManCurrency, setNewManCurrency] = useState("");
  const [newManCountry, setNewManCountry] = useState("");
  const [newManState, setNewManState] = useState("");
  const [newManCity, setNewManCity] = useState("");
  const [newManArea, setNewManArea] = useState("");
  const [newManDeliveryCharges, setNewManDeliveryCharges] = useState("");
  const [manufacturerModalError, setManufacturerModalError] = useState("");
  const [manufacturerModalLoading, setManufacturerModalLoading] = useState(false);
  // Images for edit modal
  const [galleryFiles, setGalleryFiles] = useState([]); // Array of new File objects
  const [galleryPreviews, setGalleryPreviews] = useState([]); // Array of new preview URLs
  const [existingImages, setExistingImages] = useState([]); // Array of existing image URLs
  // State for main image index in gallery
  const [mainImageIdx, setMainImageIdx] = useState(0);

  useEffect(() => {
    fetch(`${baseUrl}/v1/admin/product/get/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API endpoint not available or returning invalid data');
        }
        return res.json();
      })
      .then((data) => {
        if (!data || typeof data !== 'object' || !data.data) {
          throw new Error('Invalid data format received');
        }
        setProduct(data.data);
        setEditForm({
          name: data.data.name || '',
          short_desc: data.data.short_desc || '',
          long_desc: data.data.long_desc || '',
          price: data.data.price !== undefined && data.data.price !== null ? data.data.price : '',
          quantity: data.data.quantity !== undefined && data.data.quantity !== null ? data.data.quantity : '',
          manufacturer_id: data.data.manufacturer_id && (data.data.manufacturer_id.id || data.data.manufacturer_id) ? (data.data.manufacturer_id.id || data.data.manufacturer_id) : '',
          category_id: data.data.category_id && (data.data.category_id.id || data.data.category_id) ? (data.data.category_id.id || data.data.category_id) : '',
          // images: Array.isArray(data.data.images) ? data.data.images.join(', ') : (typeof data.data.images === 'string' ? data.data.images : ''),
        });
        setLoading(false);
        setMainImageIdx(0); // Reset main image index when product changes
        // Set existing images for edit modal when product is loaded
        if (data.data && Array.isArray(data.data.images)) {
          setExistingImages(data.data.images);
        }
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Failed to load product details. Please check if the API server is running.');
        setLoading(false);
      });
  }, [id]);

  // Fetch categories and manufacturers for dropdowns
  useEffect(() => {
    setCategoriesLoading(true);
    setCategoriesError("");
    fetch(`${baseUrl}/v1/admin/instrument-category/get`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch categories"))
      .then(data => {
        setCategories(Array.isArray(data) ? data : (data.data || []));
      })
      .catch(err => setCategoriesError(err.toString()))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    setManufacturersLoading(true);
    setManufacturersError("");
    fetch(`${baseUrl}/v1/admin/manufacturer/get`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch manufacturers"))
      .then(data => {
        setManufacturers(Array.isArray(data) ? data : (data.data || []));
      })
      .catch(err => setManufacturersError(err.toString()))
      .finally(() => setManufacturersLoading(false));
  }, []);

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle update submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    setModalMsg('');
    try {
      // Convert new images to base64
      const newImagesBase64 = await Promise.all(galleryFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));
      // Combine existing images and new images
      const images = [...existingImages, ...newImagesBase64];
      const payload = { ...editForm, images };
      const res = await fetch(`${baseUrl}/v1/admin/product/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update product');
      setModalMsg('Product updated successfully!');
      setTimeout(() => {
        setShowEdit(false);
        navigate('/products');
      }, 1200);
    } catch (err) {
      setModalError(err.message || 'Update failed');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setModalLoading(true);
    setModalError('');
    setModalMsg('');
    try {
      const res = await fetch(`${baseUrl}/v1/admin/product/delete/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setModalMsg('Product deleted successfully!');
      setTimeout(() => {
        setShowDelete(false);
        navigate('/products');
      }, 1200);
    } catch (err) {
      setModalError(err.message || 'Delete failed');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle category dropdown change in edit modal
  const handleCategoryChange = (e) => {
    if (e.target.value === 'add_new') {
      setShowCategoryModal(true);
    } else {
      setEditForm(prev => ({ ...prev, category_id: e.target.value }));
    }
  };

  // Handle manufacturer dropdown change in edit modal
  const handleManufacturerChange = (e) => {
    if (e.target.value === 'add_new') {
      setShowManufacturerModal(true);
    } else {
      setEditForm(prev => ({ ...prev, manufacturer_id: e.target.value }));
    }
  };

  // Handle file input change for gallery in edit modal
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
    setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
  };

  // Handle drag and drop for gallery in edit modal
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setGalleryFiles(files);
    setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleDragOver = (e) => e.preventDefault();

  // Ref for file input
  const fileInputRef = React.useRef();
  const handleGalleryClick = () => fileInputRef.current && fileInputRef.current.click();

  // Remove an existing image
  const handleRemoveExistingImage = (idx, e) => {
    e.stopPropagation();
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };
  // Remove a new image
  const handleRemoveNewImage = (idx, e) => {
    e.stopPropagation();
    setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="container">
        <div className="product-detail-wrapper">
          <div className="loading">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="product-detail-wrapper">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="product-detail-wrapper">
          <div className="error">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="product-detail-wrapper">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/products')}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="page-title">Product Details</h1>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
            <button className="create-bundle-btn" style={{ background: '#f59e0b' }} onClick={() => setShowEdit(true)}>
              Edit
            </button>
            <button className="create-bundle-btn" style={{ background: '#ef4444' }} onClick={() => setShowDelete(true)}>
              Delete
            </button>
          </div>
        </div>

        <div className="product-detail-card">
          {/* Product Images Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="product-images-gallery">
              <img
                src={product.images[mainImageIdx]}
                alt={product.name}
                className="product-main-image"
              />
              {product.images.length > 1 && (
                <div className="product-thumbnails">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={product.name + ' thumbnail ' + (idx + 1)}
                      className={`product-thumbnail${mainImageIdx === idx ? ' selected' : ''}`}
                      style={mainImageIdx === idx ? { border: '2px solid #10B981' } : {}}
                      onClick={() => setMainImageIdx(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="product-info">
            <div className="info-row">
              <label>Name:</label>
              <span>{product.name || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Description:</label>
              <span>{product.short_desc || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Product #:</label>
              <span>{product.product_number || 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Quantity:</label>
              <span>{product.quantity ?? 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Price:</label>
              <span>${product.price ?? '0.00'}</span>
            </div>
            <div className="info-row">
              <label>Manufacturer:</label>
              <span>{product.manufacturer_id && product.manufacturer_id.name ? product.manufacturer_id.name : 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Category:</label>
              <span>{product.category_id && product.category_id.name ? product.category_id.name : 'N/A'}</span>
            </div>
            <div className="info-row">
              <label>Featured:</label>
              <span>{product.is_featured ? <span className="badge badge-green">Yes</span> : <span className="badge badge-gray">No</span>}</span>
            </div>
            {product.product_tags && product.product_tags.length > 0 && (
              <div className="info-row">
                <label>Tags:</label>
                <span>{product.product_tags.join(', ')}</span>
              </div>
            )}
            {product.created_by && (
              <div className="info-row">
                <label>Created By:</label>
                <span>{product.created_by.username || product.created_by.id || product.created_by}</span>
              </div>
            )}
            {product.createdAt && (
              <div className="info-row">
                <label>Created:</label>
                <span>{new Date(product.createdAt).toLocaleString()}</span>
              </div>
            )}
            {product.updatedAt && (
              <div className="info-row">
                <label>Last Updated:</label>
                <span>{new Date(product.updatedAt).toLocaleString()}</span>
              </div>
            )}
            {product.long_desc && (
              <div className="info-row">
                <label>Long Description:</label>
                <span style={{ whiteSpace: 'pre-line' }}>{product.long_desc}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      {showEdit && (
        <div className="product-modal-overlay">
          <div className="product-modal-content">
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate} className="product-modal-form">
              <label>
                Name:
                <input name="name" value={editForm.name} onChange={handleEditChange} className="input" required />
              </label>
              <label>
                Description (Short):
                <input name="short_desc" value={editForm.short_desc} onChange={handleEditChange} className="input" required />
              </label>
              <label>
                Description (Long):
                <textarea name="long_desc" value={editForm.long_desc} onChange={handleEditChange} className="input" rows={3} />
              </label>
              <label>
                Price:
                <input name="price" type="number" step="0.01" value={editForm.price} onChange={handleEditChange} className="input" required />
              </label>
              <label>
                Quantity:
                <input name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange} className="input" required />
              </label>
              <label>
                Manufacturer:
                <select
                  name="manufacturer_id"
                  value={editForm.manufacturer_id}
                  onChange={handleManufacturerChange}
                  className="input"
                  required
                >
                  <option value="add_new">+ Add New Manufacturer</option>
                  <option value="">Select Manufacturer</option>
                  {manufacturersLoading && <option disabled>Loading...</option>}
                  {manufacturersError && <option disabled>Error loading manufacturers</option>}
                  {manufacturers && manufacturers.map((man, idx) => (
                    <option key={man._id || man.id || idx} value={man._id || man.id || man.name || man}>{man.name || man.label || man}</option>
                  ))}
                </select>
              </label>
              <label>
                Category:
                <select
                  name="category_id"
                  value={editForm.category_id}
                  onChange={handleCategoryChange}
                  className="input"
                  required
                >
                  <option value="add_new">+ Add New Category</option>
                  <option value="">Select Category</option>
                  {categoriesLoading && <option disabled>Loading...</option>}
                  {categoriesError && <option disabled>Error loading categories</option>}
                  {categories && categories.map((cat, idx) => (
                    <option key={cat._id || cat.id || idx} value={cat._id || cat.id || cat.name || cat}>{cat.name || cat.label || cat}</option>
                  ))}
                </select>
              </label>
              <label>
                Images:
                <div
                  className="upload-area"
                  onClick={e => {
                    // Only trigger file input if the click is directly on the upload area and not on a child (like remove button)
                    // Use closest to check if the click is on a remove button
                    if (
                      e.target === e.currentTarget ||
                      (e.target instanceof Element && !e.target.closest('.remove-image-btn'))
                    ) {
                      handleGalleryClick();
                    }
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{
                    border: '2px dashed #10B981',
                    borderRadius: 8,
                    padding: 16,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#FAFAFA',
                    marginBottom: 8
                  }}
                >
                  <Upload className="upload-icon" style={{ color: '#10B981', width: 28, height: 28, marginBottom: 6 }} />
                  <p className="upload-text" style={{ color: '#888', margin: 0, fontSize: 14 }}>Drop files here or click to upload</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="file-input"
                    ref={fileInputRef}
                    onChange={handleGalleryChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {/* Existing images with remove button */}
                  {existingImages.map((src, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={src} alt="existing" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        tabIndex={-1}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          cursor: 'pointer',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'auto',
                        }}
                        onClick={e => handleRemoveExistingImage(idx, e)}
                      >×</button>
                    </div>
                  ))}
                  {/* New images with remove button */}
                  {galleryPreviews.map((src, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={src} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        tabIndex={-1}
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          cursor: 'pointer',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: 'auto',
                        }}
                        onClick={e => handleRemoveNewImage(idx, e)}
                      >×</button>
                    </div>
                  ))}
                </div>
              </label>
              <div className="modal-btn-row">
                <button className="create-bundle-btn" type="submit" disabled={modalLoading} style={{ minWidth: 100 }}>
                  {modalLoading ? 'Saving...' : 'Save'}
                </button>
                <button className="create-bundle-btn" type="button" style={{ background: '#6b7280', minWidth: 100 }} onClick={() => setShowEdit(false)}>
                  Cancel
                </button>
              </div>
              {modalMsg && <div className="success">{modalMsg}</div>}
              {modalError && <div className="error">{modalError}</div>}
            </form>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {showDelete && (
        <div className="product-modal-overlay">
          <div className="product-modal-content">
            <h2 style={{ color: '#ef4444' }}>Delete Product</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="modal-btn-row">
              <button className="create-bundle-btn" style={{ background: '#ef4444', minWidth: 100 }} onClick={handleDelete} disabled={modalLoading}>
                {modalLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button className="create-bundle-btn" style={{ background: '#6b7280', minWidth: 100 }} onClick={() => setShowDelete(false)}>
                Cancel
              </button>
            </div>
            {modalMsg && <div className="success">{modalMsg}</div>}
            {modalError && <div className="error">{modalError}</div>}
          </div>
        </div>
      )}
      <style>{`
      .badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          margin-left: 4px;
      }
      .badge-green {
          background: #10B981;
          color: #fff;
      }
      .badge-gray {
          background: #e5e7eb;
          color: #222;
      }
      .remove-image-btn { pointer-events: auto !important; }
      .product-thumbnail.selected {
          border: 2px solid #10B981 !important;
      }
      `}</style>
    </div>
  );
};

export default ProductDetail; 