import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { Image, Upload, Trash2 } from 'lucide-react';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const CloseIcon = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute',
      top: 12,
      right: 16,
      background: 'none',
      border: 'none',
      fontSize: 22,
      color: '#6b7280',
      cursor: 'pointer',
      zIndex: 10,
      lineHeight: 1
    }}
    aria-label="Close"
    type="button"
  >
    ×
  </button>
);

const Bundles = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [modalMsg, setModalMsg] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('recent-oldest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const editFileInputRef = React.useRef();
  const [editItems, setEditItems] = useState([]);
  const sortOptions = [
    { label: 'Recent to Oldest', value: 'recent-oldest' },
    { label: 'Oldest to Recent', value: 'oldest-recent' },
    { label: 'A-Z (Name)', value: 'az' },
    { label: 'Z-A (Name)', value: 'za' },
  ];

  useEffect(() => {
    fetch(`${baseUrl}/v1/admin/bundle/get`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Bundle API response:', data);
        setBundles(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // Fetch all products for lookup
    fetch(`${baseUrl}/v1/admin/product/get`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data.data) ? data.data : []))
      .catch(() => setProducts([]));
  }, []);

  const sortedBundles = [...bundles].sort((a, b) => {
    if (sortOption === 'recent-oldest') {
      return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
    } else if (sortOption === 'oldest-recent') {
      return new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt);
    } else if (sortOption === 'az') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortOption === 'za') {
      return (b.name || '').localeCompare(a.name || '');
    }
    return 0;
  });

  const handleViewDetails = (id) => {
    setDetailsLoading(true);
    setModalOpen(true);
    fetch(`${baseUrl}bundle/get/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedBundle(data.data);
        setDetailsLoading(false);
      })
      .catch(() => setDetailsLoading(false));
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBundle(null);
  };

  const handleBundleClick = (bundle) => {
    setSelectedBundle(bundle);
    setShowDetail(true);
    setEditForm({
      name: bundle.name || '',
      short_desc: bundle.short_desc || '',
      long_desc: bundle.long_desc || '',
      price: bundle.price !== undefined && bundle.price !== null ? bundle.price : '',
      is_featured: bundle.is_featured || false,
    });
    setEditImages(Array.isArray(bundle.images) ? bundle.images : []);
    setEditImageFiles([]);
    setEditItems(Array.isArray(bundle.items) && bundle.items.length > 0 ? bundle.items.map(i => ({ product_id: i.product_id?._id || i.product_id, quantity: i.quantity || 1 })) : [{ product_id: '', quantity: 1 }]);
  };

  const handleEditOpen = (bundle) => {
    setSelectedBundle(bundle);
    setEditForm({
      name: bundle.name || '',
      short_desc: bundle.short_desc || '',
      long_desc: bundle.long_desc || '',
      price: bundle.price !== undefined && bundle.price !== null ? bundle.price : '',
      is_featured: bundle.is_featured || false,
    });
    setEditImages(Array.isArray(bundle.images) ? bundle.images : []);
    setEditImageFiles([]);
    setEditItems(Array.isArray(bundle.items) && bundle.items.length > 0 ? bundle.items.map(i => ({ product_id: i.product_id?._id || i.product_id, quantity: i.quantity || 1 })) : [{ product_id: '', quantity: 1 }]);
    setShowEdit(true);
  };

  const handleEditImageRemove = (idx) => {
    setEditImages(imgs => imgs.filter((_, i) => i !== idx));
  };

  const handleEditImageAdd = (e) => {
    const files = Array.from(e.target.files);
    setEditImageFiles(prev => [...prev, ...files]);
    setEditImages(prev => [
      ...prev,
      ...files.map(file => URL.createObjectURL(file))
    ]);
  };

  const handleEditImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setEditImageFiles(prev => [...prev, ...files]);
    setEditImages(prev => [
      ...prev,
      ...files.map(file => URL.createObjectURL(file))
    ]);
  };

  const handleEditImageDragOver = (e) => e.preventDefault();

  const handleEditImageUploadClick = () => editFileInputRef.current && editFileInputRef.current.click();

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditItemProductChange = (idx, value) => {
    setEditItems(items => items.map((item, i) => i === idx ? { ...item, product_id: value } : item));
  };

  const handleEditItemQuantityChange = (idx, value) => {
    setEditItems(items => items.map((item, i) => i === idx ? { ...item, quantity: Math.max(1, Number(value)) } : item));
  };

  const handleEditAddItem = () => {
    setEditItems(items => [...items, { product_id: '', quantity: 1 }]);
  };

  const handleEditRemoveItem = (idx) => {
    setEditItems(items => items.length > 1 ? items.filter((_, i) => i !== idx) : items);
  };

  const handleEditFeaturedChange = (e) => {
    setEditForm(f => ({ ...f, is_featured: e.target.checked }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    setModalMsg('');
    try {
      // Convert new image files to base64, keep URLs for existing
      let imagesToSend = [];
      for (let img of editImages) {
        if (img.startsWith('blob:')) {
          // Find the corresponding File object
          const fileIdx = editImages.indexOf(img);
          const file = editImageFiles[fileIdx];
          if (file) {
            const base64 = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            imagesToSend.push(base64);
          }
        } else {
          imagesToSend.push(img);
        }
      }
      // Only send valid backend fields
      const payload = {
        name: editForm.name,
        short_desc: editForm.short_desc,
        long_desc: editForm.long_desc,
        price: editForm.price,
        is_featured: editForm.is_featured,
        images: imagesToSend,
        items: editItems.filter(item => item.product_id).map(item => ({ product_id: item.product_id, quantity: item.quantity || 1 })),
        pack_size: editItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
      };
      const res = await fetch(`${baseUrl}/v1/admin/bundle/update/${selectedBundle._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update bundle');
      setModalMsg('Bundle updated successfully!');
      setTimeout(() => {
        setShowEdit(false);
        setShowDetail(false);
        window.location.reload();
      }, 1200);
    } catch (err) {
      setModalError(err.message || 'Update failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    setModalLoading(true);
    setModalError('');
    setModalMsg('');
    try {
      const res = await fetch(`${baseUrl}/v1/admin/bundle/delete/${selectedBundle._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete bundle');
      setModalMsg('Bundle deleted successfully!');
      setTimeout(() => {
        setShowDelete(false);
        setShowDetail(false);
        window.location.reload();
      }, 1200);
    } catch (err) {
      setModalError(err.message || 'Delete failed');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="bundles-wrapper">
        <div className="bundles-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <h1 className="page-title">Bundles</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className="sort-btn"
                type="button"
                onClick={() => setSortDropdownOpen((open) => !open)}
                style={{
                  padding: '8px 18px 8px 14px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(16,185,129,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 140,
                  transition: 'box-shadow 0.18s',
                }}
              >
                <span style={{ color: '#222' }}>Sort: {sortOptions.find(opt => opt.value === sortOption)?.label || 'Sort'}</span>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginLeft: 2 }}><path d="M6 8l4 4 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {sortDropdownOpen && (
                <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 16px rgba(16,185,129,0.10)', zIndex: 10, minWidth: 180, animation: 'fadeIn 0.18s' }}>
                  {sortOptions.map(opt => (
                    <div
                      key={opt.value}
                      onClick={() => { setSortOption(opt.value); setSortDropdownOpen(false); }}
                      style={{ padding: '12px 18px', cursor: 'pointer', background: sortOption === opt.value ? '#ECFDF5' : '#fff', color: sortOption === opt.value ? '#10B981' : '#222', fontWeight: sortOption === opt.value ? 600 : 400, borderRadius: 6, transition: 'background 0.15s' }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="create-bundle-btn" onClick={() => navigate('/bundles/create')} style={{ borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '8px 18px', boxShadow: '0 2px 8px rgba(16,185,129,0.07)' }}>
              + Create New Bundle
            </button>
          </div>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bundles-section">
            <table className="bundles-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedBundles.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No bundles found.</td></tr>
                ) : (
                  sortedBundles.map((bundle) => (
                    <tr key={bundle._id}>
                      <td>
                        {Array.isArray(bundle.images) && bundle.images.length > 0 ? (
                          <img src={bundle.images[0]} alt="bundle" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                        ) : (
                          <div style={{ width: 48, height: 48, background: '#F3F4F6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 22 }}>
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="18" height="14" x="3" y="5" rx="2"/><circle cx="8.5" cy="11.5" r="1.5"/><path d="M21 19 16.65 14.65a2.12 2.12 0 0 0-3 0L9 19"/></svg>
                          </div>
                        )}
                      </td>
                      <td>{bundle.name}</td>
                      <td>{bundle.short_desc}</td>
                      <td>{new Date(bundle.created_at).toLocaleString()}</td>
                      <td>
                        <button className="view-btn" onClick={() => handleBundleClick(bundle)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {showDetail && selectedBundle && (
          <div className="product-modal-overlay">
            <div className="product-modal-content" style={{ position: 'relative', minWidth: 420, maxWidth: 600 }}>
              <CloseIcon onClick={() => setShowDetail(false)} />
              <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Bundle Details</h2>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{selectedBundle.name || 'N/A'}</div>
                <div style={{ color: '#6B6B6B', marginBottom: 8 }}>{selectedBundle.short_desc || selectedBundle.long_desc || 'N/A'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>Featured:</span>
                  <span style={{ color: selectedBundle.is_featured ? '#10B981' : '#888', fontWeight: 600 }}>{selectedBundle.is_featured ? 'Yes' : 'No'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>Bundle Price:</span>
                  <span style={{ color: '#10B981', fontWeight: 700, fontSize: 16 }}>${selectedBundle.price?.toFixed(2) ?? 'N/A'}</span>
                </div>
                {/* Gallery */}
                {Array.isArray(selectedBundle.images) && selectedBundle.images.length > 0 && (
                  <div style={{ margin: '12px 0' }}>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>Gallery:</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {selectedBundle.images.map((img, idx) => (
                        <img key={idx} src={img} alt="gallery" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                      ))}
                    </div>
                  </div>
                )}
                {/* Bundle Items Table */}
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Bundle Products:</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFB' }}>
                        <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600 }}>Product</th>
                        <th style={{ textAlign: 'center', padding: '6px 8px', fontWeight: 600 }}>Quantity</th>
                        <th style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600 }}>Unit Price</th>
                        <th style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600 }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(selectedBundle.items) && selectedBundle.items.length > 0 ? selectedBundle.items.map((item, idx) => {
                        const product = products.find(p => p._id === (item.product_id?._id || item.product_id));
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #F0F0F0' }}>
                            <td style={{ padding: '6px 8px' }}>{product?.name || item.product_id || 'N/A'}</td>
                            <td style={{ textAlign: 'center', padding: '6px 8px' }}>{item.quantity || 1}</td>
                            <td style={{ textAlign: 'right', padding: '6px 8px' }}>${product?.price?.toFixed(2) ?? 'N/A'}</td>
                            <td style={{ textAlign: 'right', padding: '6px 8px' }}>${((product?.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                          </tr>
                        );
                      }) : (
                        <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No products in bundle.</td></tr>
                      )}
                    </tbody>
                  </table>
                  {/* Product total summary row */}
                  <div style={{ background: '#F8FAFB', border: '1px solid #EBF0ED', borderRadius: 6, padding: '10px 16px', marginTop: 12, fontWeight: 500, color: '#222', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span style={{ marginRight: 8, color: '#6B6B6B', fontWeight: 400 }}>Individual Product Total:</span>
                    <span style={{ fontWeight: 700, color: '#10B981', fontSize: 16 }}>
                      ${Array.isArray(selectedBundle.items) ? selectedBundle.items.reduce((sum, item) => {
                        const product = products.find(p => p._id === (item.product_id?._id || item.product_id));
                        return sum + ((product?.price || 0) * (item.quantity || 1));
                      }, 0).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
                <div style={{ color: '#888', fontSize: 13, marginTop: 10 }}>
                  Created: {selectedBundle.createdAt || selectedBundle.created_at ? new Date(selectedBundle.createdAt || selectedBundle.created_at).toLocaleString() : 'N/A'}<br />
                  Updated: {selectedBundle.updatedAt || selectedBundle.updated_at ? new Date(selectedBundle.updatedAt || selectedBundle.updated_at).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="create-bundle-btn" style={{ background: '#f59e0b' }} onClick={() => handleEditOpen(selectedBundle)}>
                  Edit
                </button>
                <button className="create-bundle-btn" style={{ background: '#ef4444' }} onClick={() => setShowDelete(true)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {showEdit && (
          <div className="product-modal-overlay">
            <div className="product-modal-content" style={{ position: 'relative', minWidth: 420, maxWidth: 600 }}>
              <CloseIcon onClick={() => setShowEdit(false)} />
              <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Edit Bundle</h2>
              <form onSubmit={handleUpdate} className="product-modal-form">
                <div className="section">
                  <div className="section-header">Description</div>
                  <div className="form-group1">
                    <label>BUNDLE NAME</label>
                    <input
                      name="name"
                      value={editForm.name ?? ''}
                      onChange={handleEditChange}
                      className="input"
                    />
                  </div>
                  <div className="form-group1">
                    <label>BUNDLE DESCRIPTION</label>
                    <textarea
                      name="short_desc"
                      value={editForm.short_desc ?? ''}
                      onChange={handleEditChange}
                      className="input"
                    />
                  </div>
                </div>
                <div className="section">
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Bundle Product</span>
                    <button type="button" className="add-btn" onClick={handleEditAddItem} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>+ Add Product</button>
                  </div>
                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', fontWeight: 600, color: '#6B6B6B', fontSize: 13, marginBottom: 6 }}>
                      <div style={{ flex: 2, padding: '0 8px' }}>Product</div>
                      <div style={{ width: 80, textAlign: 'center' }}>Quantity</div>
                      <div style={{ width: 40 }}></div>
                    </div>
                    {editItems.map((item, idx) => {
                      const product = products.find(p => p._id === item.product_id);
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <select
                            style={{ backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EBF0ED', flex: 2, marginRight: 8, height: 38 }}
                            value={item.product_id}
                            onChange={e => handleEditItemProductChange(idx, e.target.value)}
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
                            onChange={e => handleEditItemQuantityChange(idx, e.target.value)}
                            style={{ width: 70, marginRight: 8, height: 38, textAlign: 'center' }}
                          />
                          <button type="button" className="remove-btn" onClick={() => handleEditRemoveItem(idx)} style={{ background: 'none', border: 'none', color: '#d32f2f', fontSize: 22, cursor: 'pointer', width: 40, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove">
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
                      ${editItems.reduce((sum, item) => {
                        const product = products.find(p => p._id === item.product_id);
                        return sum + ((product?.price || 0) * (item.quantity || 1));
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="section">
                  <div className="section-header">Pricing</div>
                  <div className="form-group1">
                    <label>PRICE $</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="Enter Bundle Price"
                      value={editForm.price}
                      onChange={handleEditChange}
                      min={0}
                    />
                  </div>
                </div>
                <div className="section">
                  <div className="section-header">Other Settings</div>
                  <div className="form-group1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>FEATURED BUNDLE</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!!editForm.is_featured}
                        onChange={handleEditFeaturedChange}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                {/* Gallery Edit Section */}
                <div className="section" style={{ margin: '18px 0', background: '#FAFAFA', borderRadius: 8, boxShadow: '0 2px 8px rgba(16,185,129,0.07)' }}>
                  <div className="section-header" style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Bundle Gallery</div>
                  <div
                    className="upload-area"
                    onClick={handleEditImageUploadClick}
                    onDrop={handleEditImageDrop}
                    onDragOver={handleEditImageDragOver}
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
                      ref={editFileInputRef}
                      onChange={handleEditImageAdd}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    {editImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 60, height: 60 }}>
                        <img src={img} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                        <button type="button" onClick={() => handleEditImageRemove(idx)} style={{ position: 'absolute', top: -8, right: -8, background: '#fff', border: '1px solid #eee', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                          <Trash2 size={14} color="#d32f2f" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
        {showDelete && (
          <div className="product-modal-overlay">
            <div className="product-modal-content" style={{ position: 'relative' }}>
              <CloseIcon onClick={() => setShowDelete(false)} />
              <h2 style={{ color: '#ef4444' }}>Delete Bundle</h2>
              <p>Are you sure you want to delete this bundle?</p>
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
      </div>
      <style>{`
        .sort-btn:focus { outline: 2px solid #10B981; }
        .sort-btn { transition: background 0.15s, box-shadow 0.18s; }
        .sort-btn:hover { background: #f3f4f6; box-shadow: 0 4px 16px rgba(16,185,129,0.13); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Bundles; 
