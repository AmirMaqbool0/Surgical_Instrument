import React, { useState, useEffect } from "react";
import "./style.css";
import { Header } from "../../components";
import { Upload } from 'lucide-react';
import Modal from 'react-modal';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Allowed currencies for manufacturer
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY"];

// Modal custom styles
const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '32px 28px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        border: 'none',
        minWidth: '350px',
        maxWidth: '95vw',
        background: '#fff',
        zIndex: 1001,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
    },
};

// Add a smaller, scrollable style for manufacturer modal
const manufacturerModalStyles = {
    ...customModalStyles,
    content: {
        ...customModalStyles.content,
        maxWidth: '420px',
        maxHeight: '80vh',
        overflowY: 'auto',
    },
};

const Products = () => {
    // State for all form fields
    const [name, setname] = useState("");
    const [long_desc, setlong_desc] = useState("");
    const [category_id, setcategory_id] = useState("");
    const [short_desc, setshort_desc] = useState("");
    const [manufacturer_id, setmanufacturer_id] = useState("");
    const [quantity, setquantity] = useState("");
    const [price, setPrice] = useState("");
    // Optional fields
    const [isFeatured, setIsFeatured] = useState(false);
    const [productTags, setProductTags] = useState(""); // comma-separated string
    // Images
    const [galleryFiles, setGalleryFiles] = useState([]); // Array of File objects
    const [galleryPreviews, setGalleryPreviews] = useState([]); // Array of preview URLs
    // Feedback and loading
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // Dropdown data
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState("");
    const [manufacturers, setManufacturers] = useState([]);
    const [manufacturersLoading, setManufacturersLoading] = useState(false);
    const [manufacturersError, setManufacturersError] = useState("");
    // Modal state
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
    // Dynamic lists for manufacturer modal
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

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

    // Fetch country list for manufacturer modal
    useEffect(() => {
        if (showManufacturerModal) {
            fetch(`${baseUrl}/v1/region/country/get-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            })
                .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch countries"))
                .then(data => setCountryList(data.data?.countries || []))
                .catch(() => setCountryList([]));
        }
    }, [showManufacturerModal]);
    // Fetch state list when country changes
    useEffect(() => {
        if (showManufacturerModal && newManCountry) {
            fetch(`${baseUrl}/v1/region/state/get-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country_code: newManCountry })
            })
                .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch states"))
                .then(data => setStateList(data.data?.states || []))
                .catch(() => setStateList([]));
        } else {
            setStateList([]);
        }
    }, [showManufacturerModal, newManCountry]);
    // Fetch city list when state changes
    useEffect(() => {
        if (showManufacturerModal && newManCountry && newManState) {
            fetch(`${baseUrl}/v1/region/city/get-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country_code: newManCountry, state_code: newManState })
            })
                .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch cities"))
                .then(data => setCityList(data.data?.cities || []))
                .catch(() => setCityList([]));
        } else {
            setCityList([]);
        }
    }, [showManufacturerModal, newManCountry, newManState]);

    // Handle file input change for gallery
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setGalleryFiles(files);
        setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
    };
    // Handle drag and drop for gallery
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        // Validation for required fields
        if (!name || !short_desc || !long_desc || !price || !manufacturer_id || !category_id || !quantity || galleryFiles.length === 0) {
            setError("Please fill all required fields: Name, Short Description, Long Description, Price, Manufacturer, Category, Quantity, and Images.");
            setLoading(false);
            return;
        }
        try {
            // Convert images to base64
            const imagesBase64 = await Promise.all(galleryFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }));
            // Prepare JSON payload
            const payload = {
                name,
                short_desc,
                long_desc,
                price: Number(price),
                manufacturer_id,
                category_id,
                quantity: Number(quantity),
                is_featured: isFeatured,
                product_tags: productTags
                    ? productTags.split(",").map(tag => tag.trim()).filter(Boolean)
                    : [],
                images: imagesBase64
            };
            const response = await fetch(`${baseUrl}/v1/admin/product/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("Failed to create product");
            setSuccess("Product created successfully!");
            setGalleryFiles([]);
            setGalleryPreviews([]);
        } catch (err) {
            setError(err.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Handle category dropdown change
    const handleCategoryChange = (e) => {
        if (e.target.value === 'add_new') {
            setShowCategoryModal(true);
        } else {
            setcategory_id(e.target.value);
        }
    };
    // Handle manufacturer dropdown change
    const handleManufacturerChange = (e) => {
        if (e.target.value === 'add_new') {
            setShowManufacturerModal(true);
        } else {
            setmanufacturer_id(e.target.value);
        }
    };

    // Handle category modal submit
    const handleCategoryModalSubmit = async (e) => {
        e.preventDefault();
        setCategoryModalError("");
        setCategoryModalLoading(true);
        if (!newCategoryName || !newCategoryDesc) {
            setCategoryModalError("Name and Description are required.");
            setCategoryModalLoading(false);
            return;
        }
        let imageBase64 = "";
        if (newCategoryImage) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                imageBase64 = reader.result;
                await submitCategory(imageBase64);
            };
            reader.readAsDataURL(newCategoryImage);
        } else {
            await submitCategory("");
        }
    };
    const submitCategory = async (imageBase64) => {
        try {
            const payload = {
                name: newCategoryName,
                description: newCategoryDesc,
                image: imageBase64
            };
            const response = await fetch(`${baseUrl}/v1/admin/instrument-category/create`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Failed to create category");
            const data = await response.json();
            setCategories(prev => [...prev, data.data.newCategory]);
            setcategory_id(data.data.newCategory._id || data.data.newCategory.id);
            setShowCategoryModal(false);
            setNewCategoryName("");
            setNewCategoryDesc("");
            setNewCategoryImage(null);
        } catch (err) {
            setCategoryModalError(err.message || "Error occurred");
        } finally {
            setCategoryModalLoading(false);
        }
    };

    // Handle manufacturer modal submit
    const handleManufacturerModalSubmit = async (e) => {
        e.preventDefault();
        setManufacturerModalError("");
        setManufacturerModalLoading(true);
        if (!newManName || !newManDesc || !newManCurrency || !newManCountry || !newManState || !newManCity || !newManArea) {
            setManufacturerModalError("All fields except logo and delivery charges are required.");
            setManufacturerModalLoading(false);
            return;
        }
        let logoBase64 = "";
        if (newManLogo) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                logoBase64 = reader.result;
                await submitManufacturer(logoBase64);
            };
            reader.readAsDataURL(newManLogo);
        } else {
            await submitManufacturer("");
        }
    };
    const submitManufacturer = async (logoBase64) => {
        try {
            const payload = {
                name: newManName,
                description: newManDesc,
                logo: logoBase64,
                currency: newManCurrency,
                country: newManCountry,
                state: newManState,
                city: newManCity,
                area: newManArea,
                delivery_charges: newManDeliveryCharges ? Number(newManDeliveryCharges) : undefined
            };
            const response = await fetch(`${baseUrl}/v1/admin/manufacturer/create`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Failed to create manufacturer");
            const data = await response.json();
            setManufacturers(prev => [...prev, data.data.newManufacturer]);
            setmanufacturer_id(data.data.newManufacturer._id || data.data.newManufacturer.id);
            setShowManufacturerModal(false);
            setNewManName("");
            setNewManDesc("");
            setNewManLogo(null);
            setNewManCurrency("");
            setNewManCountry("");
            setNewManState("");
            setNewManCity("");
            setNewManArea("");
            setNewManDeliveryCharges("");
        } catch (err) {
            setManufacturerModalError(err.message || "Error occurred");
        } finally {
            setManufacturerModalLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="products-wrapper">
                <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: '#222' }}>Create New Product</h1>
                <form onSubmit={handleSubmit}>
                    {/* Feedback messages */}
                    {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginBottom: 10 }}>{success}</div>}
                    <div>
                        <div className="section">
                            <div className="section-header">
                                <span>Description</span>
                            </div>
                            <div className="form-group1">
                                <label>PRODUCT NAME</label>
                                <input
                                    type="text"
                                    placeholder="Enter Product Name"
                                    value={name}
                                    onChange={e => setname(e.target.value)}
                                />
                            </div>
                            <div className="form-group1">
                                <label>PRODUCT DESCRIPTION</label>
                                <textarea
                                    placeholder="Enter Product Description"
                                    value={long_desc}
                                    onChange={e => setlong_desc(e.target.value)}
                                />
                            </div>
                            <div className="form-group1">
                                <label>PRODUCT SHORT DESCRIPTION</label>
                                <input
                                    type="text"
                                    placeholder="Enter Product Short Description"
                                    value={short_desc}
                                    onChange={e => setshort_desc(e.target.value)}
                                    maxLength={500}
                                />
                            </div>
                            <div className="form-group1">
                                <label>PRODUCT CATEGORY</label>
                                <select
                                    style={{ backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EBF0ED' }}
                                    value={category_id}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="add_new">+ Add New Category</option>
                                    <option value="">Select Category</option>
                                    {categoriesLoading && <option disabled>Loading...</option>}
                                    {categoriesError && <option disabled>Error loading categories</option>}
                                    {categories && categories.map((cat, idx) => (
                                        <option key={cat._id || cat.id || idx} value={cat._id || cat.id || cat.name || cat}>{cat.name || cat.label || cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group1">
                                <label>MANUFACTURER NAME</label>
                                <select
                                    style={{ backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#EBF0ED' }}
                                    value={manufacturer_id}
                                    onChange={handleManufacturerChange}
                                >
                                    <option value="add_new">+ Add New Manufacturer</option>
                                    <option value="">Select Manufacturer</option>
                                    {manufacturersLoading && <option disabled>Loading...</option>}
                                    {manufacturersError && <option disabled>Error loading manufacturers</option>}
                                    {manufacturers && manufacturers.map((man, idx) => (
                                        <option key={man._id || man.id || idx} value={man._id || man.id || man.name || man}>{man.name || man.label || man}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group1">
                                <label>STOCK</label>
                                <input
                                    type="number"
                                    placeholder="Enter Stock"
                                    value={quantity}
                                    onChange={e => setquantity(e.target.value)}
                                    min={1}
                                />
                            </div>
                            <div className="form-group1">
                                <label>PRICE $</label>
                                <input
                                    type="number"
                                    placeholder="Enter Price"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    min={0}
                                />
                            </div>
                            <div className="form-group1">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span>FEATURED PRODUCT</span>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={e => setIsFeatured(e.target.checked)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </label>
                            </div>
                            <div className="form-group1">
                                <label>PRODUCT TAGS (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="tag1, tag2, tag3"
                                    value={productTags}
                                    onChange={e => setProductTags(e.target.value)}
                                />
                            </div>
                            <div className="section">
                                <h2 className="section-title">Product Gallery</h2>
                                <div
                                    className="upload-area"
                                    onClick={handleGalleryClick}
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
                                        onChange={handleGalleryChange}
                                        style={{ display: 'none' }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                    {galleryPreviews.map((src, idx) => (
                                        <img key={idx} src={src} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #EBF0ED', backgroundColor: '#fff' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#10B981', color: '#fff', border: 'none' }} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
                            </div>
                        </div>
                    </div>
                </form>
                {/* Category Modal */}
                <Modal
                    isOpen={showCategoryModal}
                    onRequestClose={() => setShowCategoryModal(false)}
                    contentLabel="Add New Category"
                    ariaHideApp={false}
                    style={customModalStyles}
                >
                    <h2 style={{ marginBottom: 18, fontWeight: 600, fontSize: 22 }}>Add New Category</h2>
                    <form onSubmit={handleCategoryModalSubmit}>
                        <div className="form-group1">
                            <label>Name</label>
                            <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} required />
                        </div>
                        <div className="form-group1">
                            <label>Description</label>
                            <textarea value={newCategoryDesc} onChange={e => setNewCategoryDesc(e.target.value)} maxLength={100} required />
                        </div>
                        <div className="form-group1">
                            <label>Image (optional)</label>
                            <input type="file" accept="image/*" onChange={e => setNewCategoryImage(e.target.files[0])} />
                        </div>
                        {categoryModalError && <div style={{ color: 'red', marginTop: 8 }}>{categoryModalError}</div>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                            <button type="button" className="modal-btn cancel" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                            <button type="submit" className="modal-btn submit" disabled={categoryModalLoading}>{categoryModalLoading ? 'Adding...' : 'Add Category'}</button>
                        </div>
                    </form>
                </Modal>
                {/* Manufacturer Modal */}
                <Modal
                    isOpen={showManufacturerModal}
                    onRequestClose={() => setShowManufacturerModal(false)}
                    contentLabel="Add New Manufacturer"
                    ariaHideApp={false}
                    style={manufacturerModalStyles}
                >
                    <h2 style={{ marginBottom: 18, fontWeight: 600, fontSize: 22 }}>Add New Manufacturer</h2>
                    <form onSubmit={handleManufacturerModalSubmit}>
                        <div className="form-group1">
                            <label>Name</label>
                            <input type="text" value={newManName} onChange={e => setNewManName(e.target.value)} required />
                        </div>
                        <div className="form-group1">
                            <label>Description</label>
                            <textarea value={newManDesc} onChange={e => setNewManDesc(e.target.value)} maxLength={500} required />
                        </div>
                        <div className="form-group1">
                            <label>Logo (optional)</label>
                            <input type="file" accept="image/*" onChange={e => setNewManLogo(e.target.files[0])} />
                        </div>
                        <div className="form-group1">
                            <label>Currency</label>
                            <select value={newManCurrency} onChange={e => setNewManCurrency(e.target.value)} required>
                                <option value="">Select Currency</option>
                                {CURRENCIES.map(cur => <option key={cur} value={cur}>{cur}</option>)}
                            </select>
                        </div>
                        <div className="form-group1">
                            <label>Country</label>
                            <input type="text" value={newManCountry} onChange={e => setNewManCountry(e.target.value)} required placeholder="Enter Country" />
                        </div>
                        <div className="form-group1">
                            <label>State</label>
                            <input type="text" value={newManState} onChange={e => setNewManState(e.target.value)} required placeholder="Enter State" />
                        </div>
                        <div className="form-group1">
                            <label>City</label>
                            <input type="text" value={newManCity} onChange={e => setNewManCity(e.target.value)} required placeholder="Enter City" />
                        </div>
                        <div className="form-group1">
                            <label>Area</label>
                            <input type="text" value={newManArea} onChange={e => setNewManArea(e.target.value)} required />
                        </div>
                        <div className="form-group1">
                            <label>Delivery Charges</label>
                            <input type="number" value={newManDeliveryCharges} onChange={e => setNewManDeliveryCharges(e.target.value)} min="0" />
                        </div>
                        {manufacturerModalError && <div style={{ color: 'red', marginTop: 8 }}>{manufacturerModalError}</div>}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                            <button type="button" className="modal-btn cancel" onClick={() => setShowManufacturerModal(false)}>Cancel</button>
                            <button type="submit" className="modal-btn submit" disabled={manufacturerModalLoading}>{manufacturerModalLoading ? 'Adding...' : 'Add Manufacturer'}</button>
                        </div>
                    </form>
                </Modal>
                {/* Modal button styles */}
                <style>{`
                    .modal-btn {
                        padding: 8px 20px;
                        border-radius: 6px;
                        border: none;
                        font-size: 15px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background 0.18s, color 0.18s;
                    }
                    .modal-btn.cancel {
                        background: #f3f4f6;
                        color: #222;
                        border: 1px solid #e5e7eb;
                    }
                    .modal-btn.cancel:hover {
                        background: #e5e7eb;
                    }
                    .modal-btn.submit {
                        background: #10B981;
                        color: #fff;
                    }
                    .modal-btn.submit:hover {
                        background: #059669;
                    }
                    .ReactModal__Overlay {
                        z-index: 1000 !important;
                    }
                    .switch {
                        position: relative;
                        display: inline-block;
                        width: 44px;
                        height: 24px;
                    }
                    .switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }
                    .slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #e5e7eb;
                        transition: .3s;
                        border-radius: 24px;
                    }
                    .slider:before {
                        position: absolute;
                        content: "";
                        height: 18px;
                        width: 18px;
                        left: 3px;
                        bottom: 3px;
                        background-color: white;
                        transition: .3s;
                        border-radius: 50%;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                    }
                    input:checked + .slider {
                        background-color: #10B981;
                    }
                    input:checked + .slider:before {
                        transform: translateX(20px);
                    }
                    .slider.round {
                        border-radius: 24px;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Products;