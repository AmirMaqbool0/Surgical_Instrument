import React, { useState, useEffect } from 'react';
import { ChevronDown, Upload, Trash2 } from 'lucide-react';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
import './style.css';
import '../../screens/CreateProduct/style.css';

const CreateBundle = () => {
  const [bundleName, setBundleName] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");
  const [bundleItems, setBundleItems] = useState([{ product_id: '', quantity: 1 }]);
  const [bundlePrice, setBundlePrice] = useState("");
  const [bundleFiles, setBundleFiles] = useState([]);
  const [bundlePreviews, setBundlePreviews] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  const fileInputRef = React.useRef();
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setBundleFiles(files);
    setBundlePreviews(files.map(file => URL.createObjectURL(file)));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setBundleFiles(files);
    setBundlePreviews(files.map(file => URL.createObjectURL(file)));
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleUploadClick = () => fileInputRef.current && fileInputRef.current.click();

  useEffect(() => {
    fetch(`${baseUrl}/v1/admin/product/get`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data.data) ? data.data : []))
      .catch(() => setProducts([]));

    fetch(`${baseUrl}/v1/admin/instrument-category/get`)
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data.data) ? data.data : []))
      .catch(() => setCategories([]));

    fetch(`${baseUrl}/v1/admin/manufacturer/get`)
      .then(res => res.json())
      .then(data => setManufacturers(Array.isArray(data.data) ? data.data : []))
      .catch(() => setManufacturers([]));
  }, []);

  const handleItemProductChange = (idx, value) => {
    setBundleItems(items => items.map((item, i) => i === idx ? { ...item, product_id: value } : item));
  };
  const handleItemQuantityChange = (idx, value) => {
    setBundleItems(items => items.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, Number(value)) } : item));
  };
  const handleAddItem = () => {
    setBundleItems(items => [...items, { product_id: '', quantity: 1 }]);
  };
  const handleRemoveItem = (idx) => {
    setBundleItems(items => items.length > 1 ? items.filter((_, i) => i !== idx) : items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    // --- Validate Required Fields ---
    const parsedPrice = parseFloat(bundlePrice);

    // Validate at least one item with product selected
    if (!bundleItems.some(item => item.product_id)) {
      setSubmitError("Please select at least one product.");
      setSubmitLoading(false);
      return;
    }

    try {
      const payload = {
        name: bundleName,
        short_desc: bundleDescription,
        long_desc: bundleDescription,
        price: parsedPrice,
        images: [],
        pack_size: bundleItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
        items: bundleItems.filter(item => item.product_id).map(item => ({ product_id: item.product_id, quantity: item.quantity || 1 })),
        is_featured: Boolean(isFeatured),
      };

      const response = await fetch(`${baseUrl}/v1/admin/bundle/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create bundle');
      }

      setSubmitSuccess('Bundle created successfully!');
      setBundleName("");
      setBundleDescription("");
      setBundleItems([{ product_id: '', quantity: 1 }]);
      setBundlePrice("");
      setBundleFiles([]);
      setBundlePreviews([]);
      setIsFeatured(false);
    } catch (err) {
      setSubmitError(err.message || 'An error occurred');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="container" style={{ background: '#F6FAFB', minHeight: '100vh', padding: '32px 0' }}>
      <div className="bundles-wrapper">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#222' }}>Create New Bundle</h1>
        <form onSubmit={handleSubmit}>
          {submitError && <div style={{ color: 'red', marginBottom: 10 }}>{submitError}</div>}
          {submitSuccess && <div style={{ color: 'green', marginBottom: 10 }}>{submitSuccess}</div>}
          <div>
            {/* Description Card */}
            <div className="section">
              <div className="section-header">Description</div>
              <div className="form-group1">
                <label>BUNDLE NAME</label>
                <input
                  type="text"
                  placeholder="Enter Bundle Name"
                  value={bundleName}
                  onChange={e => setBundleName(e.target.value)}
                />
              </div>
              <div className="form-group1">
                <label>BUNDLE DESCRIPTION</label>
                <textarea
                  placeholder="Enter Bundle Description"
                  value={bundleDescription}
                  onChange={e => setBundleDescription(e.target.value)}
                />
              </div>
            </div>
            {/* Bundle Product Card */}
            <div className="section">
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Bundle Product</span>
                <button type="button" className="add-btn" onClick={handleAddItem} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>+ Add Product</button>
              </div>
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <div style={{ display: 'flex', fontWeight: 600, color: '#6B6B6B', fontSize: 13, marginBottom: 6 }}>
                  <div style={{ flex: 2, padding: '0 8px' }}>Product</div>
                  <div style={{ width: 80, textAlign: 'center' }}>Quantity</div>
                  <div style={{ width: 40 }}></div>
                </div>
                {bundleItems.map((item, idx) => {
                  const product = products.find(p => p._id === item.product_id);
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <select
                        style={{ backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EBF0ED', flex: 2, marginRight: 8, height: 38 }}
                        value={item.product_id}
                        onChange={e => handleItemProductChange(idx, e.target.value)}
                      >
                        <option value="">Select Product</option>
                        {products.map((prod) => (
                          <option key={prod._id} value={prod._id}>{prod.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        className="quantity-input"
                        value={item.quantity}
                        onChange={e => handleItemQuantityChange(idx, e.target.value)}
                        style={{ width: 70, marginRight: 8, height: 38, textAlign: 'center' }}
                      />
                      <button type="button" className="remove-btn" onClick={() => handleRemoveItem(idx)} style={{ background: 'none', border: 'none', color: '#d32f2f', fontSize: 22, cursor: 'pointer', width: 40, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* Product total summary row */}
              <div style={{ background: '#F8FAFB', border: '1px solid #EBF0ED', borderRadius: 6, padding: '10px 16px', marginTop: 12, fontWeight: 500, color: '#222', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span style={{ marginRight: 8, color: '#6B6B6B', fontWeight: 400 }}>Individual Product Total:</span>
                <span style={{ fontWeight: 700, color: '#10B981', fontSize: 16 }}>
                  ${bundleItems.reduce((sum, item) => {
                    const product = products.find(p => p._id === item.product_id);
                    return sum + ((product?.price || 0) * (item.quantity || 1));
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>
            {/* Pricing Card */}
            <div className="section">
              <div className="section-header">Pricing</div>
              <div className="form-group1">
                <label>PRICE $</label>
                <input
                  type="number"
                  placeholder="Enter Bundle Price"
                  value={bundlePrice}
                  onChange={e => setBundlePrice(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            {/* Other Settings Card */}
            <div className="section">
              <div className="section-header">Other Settings</div>
              <div className="form-group1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className='form-group1'>FEATURED BUNDLE</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            {/* Gallery Card */}
            <div className="section">
              <div className="section-header">Bundle Gallery</div>
              <div
                className="upload-area"
                onClick={handleUploadClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  border: '2px dashed #10B981',
                  borderRadius: 8,
                  padding: 24,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#FAFAFA',
                  marginBottom: 16
                }}
              >
                <Upload className="upload-icon" style={{ color: '#10B981', width: 32, height: 32, marginBottom: 8 }} />
                <p className="upload-text" style={{ color: '#888', margin: 0 }}>Drop files here or click to upload</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="file-input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {bundlePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                ))}
              </div>
            </div>
            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #EBF0ED', backgroundColor: '#fff' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#10B981', color: '#fff', border: 'none' }} disabled={submitLoading}>{submitLoading ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBundle;