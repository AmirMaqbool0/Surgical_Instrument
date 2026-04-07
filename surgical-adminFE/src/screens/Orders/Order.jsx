import React, { useEffect, useState } from 'react';
import './style.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const paymentStatusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];
const deliveryStatusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];
const currencyOptions = [
  { value: '', label: 'All' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'PKR', label: 'PKR' },
  { value: 'INR', label: 'INR' },
];

const Orders = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [editPaymentStatus, setEditPaymentStatus] = useState('');
  const [editDeliveryStatus, setEditDeliveryStatus] = useState('');
  const [modalMsg, setModalMsg] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const tabFilters = [
    { label: 'ALL ORDERS', value: 'all' },
    { label: 'NEW', value: 'new' },
    { label: 'CANCELLED', value: 'cancelled' },
    { label: 'IN PROGRESS', value: 'in-progress' },
    { label: 'COMPLETED', value: 'completed' },
  ];
  const [activeTab, setActiveTab] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];

  const [showFilters, setShowFilters] = useState(false);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState('');
  const [filterCurrency, setFilterCurrency] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterCreatedAtFrom, setFilterCreatedAtFrom] = useState('');
  const [filterCreatedAtTo, setFilterCreatedAtTo] = useState('');

  const filteredOrders = orderData.filter(order => {
    // Payment status
    if (filterPaymentStatus && order.payment_info?.status !== filterPaymentStatus) return false;
    // Delivery status
    if (filterDeliveryStatus && order.delivery_info?.status !== filterDeliveryStatus) return false;
    // Currency
    if (filterCurrency && order.currency !== filterCurrency) return false;
    // Price range
    if (filterPriceMin && Number(order.amount) < Number(filterPriceMin)) return false;
    if (filterPriceMax && Number(order.amount) > Number(filterPriceMax)) return false;
    // Created at range
    if (filterCreatedAtFrom && new Date(order.created_at) < new Date(filterCreatedAtFrom)) return false;
    if (filterCreatedAtTo && new Date(order.created_at) > new Date(filterCreatedAtTo)) return false;
    return true;
  });

  const searchedOrders = filteredOrders.filter(order => {
    const orderNumber = (order.orderNumber || '').toLowerCase();
    const customer = (order.customer || order.customerName || '').toLowerCase();
    const payment = (order.payment || order.paymentMethod || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      orderNumber.includes(term) ||
      customer.includes(term) ||
      payment.includes(term)
    );
  });

  const getTabCount = (tab) => {
    if (tab.value === 'all') return orderData.length;
    if (tab.value === 'new') {
      return orderData.filter(order => {
        const orderDate = order.date ? order.date.split('T')[0] : '';
        return (order.payment_info?.status || '').toLowerCase() === 'new' || orderDate === todayStr;
      }).length;
    }
    if (tab.value === 'completed') {
      return orderData.filter(order => (order.payment_info?.status || '').toLowerCase() === 'success').length;
    }
    if (tab.value === 'in-progress') {
      return orderData.filter(order => (order.payment_info?.status || '').toLowerCase() === 'pending').length;
    }
    return orderData.filter(order => (order.payment_info?.status || '').toLowerCase() === tab.value).length;
  };

  const ORDERS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const [sortOption, setSortOption] = useState('recent-oldest');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const sortOptions = [
    { label: 'Highest to Lowest Amount', value: 'amount-desc' },
    { label: 'Lowest to Highest Amount', value: 'amount-asc' },
    { label: 'Recent to Oldest', value: 'recent-oldest' },
    { label: 'Oldest to Recent', value: 'oldest-recent' },
  ];

  const sortedOrders = [...searchedOrders].sort((a, b) => {
    if (sortOption === 'amount-desc') {
      return (b.finalAmount || 0) - (a.finalAmount || 0);
    } else if (sortOption === 'amount-asc') {
      return (a.finalAmount || 0) - (b.finalAmount || 0);
    } else if (sortOption === 'recent-oldest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOption === 'oldest-recent') {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, orderData.length, searchTerm]);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseUrl}/v1/admin/order/getAll`)
      .then(res => res.ok ? res.json() : Promise.resolve({ data: { orders: [] } }))
      .then(data => {
        setOrderData((data.data && data.data.orders) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const allCount = orderData.length;
  const pendingCount = orderData.filter(order => order.payment_info?.status !== 'success').length;
  const completedCount = orderData.filter(order => order.payment_info?.status === 'success' && order.delivery_info?.status === 'delivered').length;
  const inProgressCount = orderData.filter(order => order.payment_info?.status === 'success' && order.delivery_info?.status !== 'delivered').length;
  const abandonedCount = orderData.filter(order => order.delivery_info?.status === 'rejected').length;
  const cancelledCount = orderData.filter(order => order.delivery_info?.status === 'cancelled').length;
  const damagedCount = orderData.filter(order => (order.payment_info?.status || '').toLowerCase() === 'damaged').length;
  const otherCount = orderData.filter(order => {
    const status = (order.payment_info?.status || '').toLowerCase();
    return !['pending', 'success', 'in-progress', 'abandoned', 'cancelled', 'damaged'].includes(status);
  }).length;

  // Function to open edit modal for an order
  const handleEditClick = (order) => {
    setEditOrder(order);
    setEditPaymentStatus(order.payment_info?.status || '');
    setEditDeliveryStatus(order.delivery_info?.status || '');
    setShowEdit(true);
  };

  // Function to handle status change
  const handleStatusChange = (e) => {
    setEditPaymentStatus(e.target.value);
  };

  // Function to submit status update
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalMsg('');
    setModalError('');
    try {
      // Only send fields that have changed
      const body = {};
      if (editPaymentStatus !== editOrder.payment_info?.status) {
        body.paymentStatus = editPaymentStatus;
      }
      if (editDeliveryStatus !== editOrder.delivery_info?.status) {
        body.orderStatus = editDeliveryStatus;
      }
      if (!body.paymentStatus && !body.orderStatus) {
        setModalError('No changes to update.');
        setModalLoading(false);
        return;
      }
      const res = await fetch(`${baseUrl}/v1/admin/order/update/${editOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      setModalMsg('Order status updated successfully!');
      setTimeout(() => {
        setShowEdit(false);
        window.location.reload();
      }, 1200);
    } catch (err) {
      setModalError(err.message || 'Update failed');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="products-wrapper">
        <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="stat-card success" style={{ width: '100%' }}>
            <div className="stat-card-header">
              <h3 className="stat-card-title">Order Statuses</h3>
            </div>
            <div className="stat-items order-statuses">
              <div className="stat-status-group">
                <div className="stat-status-title">Payment Status</div>
                <div className="stat-status-list">
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.payment_info?.status === 'pending').length}</div><div className="stat-label">Pending</div></div>
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.payment_info?.status === 'success').length}</div><div className="stat-label">Success</div></div>
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.payment_info?.status === 'failed').length}</div><div className="stat-label">Failed</div></div>
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.payment_info?.status === 'refunded').length}</div><div className="stat-label">Refunded</div></div>
                </div>
              </div>
              <div className="stat-status-divider"></div>
              <div className="stat-status-group">
                <div className="stat-status-title">Delivery Status</div>
                <div className="stat-status-list">
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.delivery_info?.status === 'pending').length}</div><div className="stat-label">Pending</div></div>
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.delivery_info?.status === 'in_progress').length}</div><div className="stat-label">In Progress</div></div>
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.delivery_info?.status === 'delivered').length}</div><div className="stat-label">Delivered</div></div>
                  <div className="stat-item"><div className="stat-number">{orderData.filter(o => o.delivery_info?.status === 'cancelled').length}</div><div className="stat-label">Cancelled</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="orders-section">
          <div className="orders-header">
            <div className="orders-search">
              <svg className="order-search-icon" height={24} width={24} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
              <input
                type="text"
                className="orders-search-input"
                placeholder="Search for Order..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button className="filters-btn" onClick={() => setShowFilters(v => !v)}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  Filters
                </button>
                {showFilters && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 16px rgba(16,185,129,0.10)', zIndex: 10, minWidth: 320, padding: 18 }}>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontWeight: 500 }}>Price Range:</label>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <input type="number" placeholder="Min" value={filterPriceMin} onChange={e => setFilterPriceMin(e.target.value)} style={{ width: 70, padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }} />
                        <span style={{ color: '#888', fontWeight: 600 }}>-</span>
                        <input type="number" placeholder="Max" value={filterPriceMax} onChange={e => setFilterPriceMax(e.target.value)} style={{ width: 70, padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontWeight: 500 }}>Payment Status:</label>
                      <select value={filterPaymentStatus} onChange={e => setFilterPaymentStatus(e.target.value)} style={{ width: '100%', padding: 4, border: '1px solid #e5e7eb', borderRadius: 4, marginTop: 4 }}>
                        {paymentStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontWeight: 500 }}>Delivery Status:</label>
                      <select value={filterDeliveryStatus} onChange={e => setFilterDeliveryStatus(e.target.value)} style={{ width: '100%', padding: 4, border: '1px solid #e5e7eb', borderRadius: 4, marginTop: 4 }}>
                        {deliveryStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontWeight: 500 }}>Currency:</label>
                      <select value={filterCurrency} onChange={e => setFilterCurrency(e.target.value)} style={{ width: '100%', padding: 4, border: '1px solid #e5e7eb', borderRadius: 4, marginTop: 4 }}>
                        {currencyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontWeight: 500 }}>Created At:</label>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <input type="date" value={filterCreatedAtFrom} onChange={e => setFilterCreatedAtFrom(e.target.value)} style={{ padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }} />
                        <span style={{ color: '#888', fontWeight: 600 }}>to</span>
                        <input type="date" value={filterCreatedAtTo} onChange={e => setFilterCreatedAtTo(e.target.value)} style={{ padding: 4, border: '1px solid #e5e7eb', borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                      <button onClick={() => { setFilterPaymentStatus(''); setFilterDeliveryStatus(''); setFilterCurrency(''); setFilterPriceMin(''); setFilterPriceMax(''); setFilterCreatedAtFrom(''); setFilterCreatedAtTo(''); }} style={{ flex: 1, background: '#f3f4f6', color: '#222', border: 'none', borderRadius: 6, padding: '8px 0', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
                      <button onClick={() => setShowFilters(false)} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontWeight: 600, cursor: 'pointer' }}>Apply</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="sort-btn-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                <button className="filters-btn" onClick={() => setSortDropdownOpen(v => !v)}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h6" />
                  </svg>
                  Sort
                </button>
                {sortDropdownOpen && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #eee', borderRadius: 4, zIndex: 10, minWidth: 180, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    {sortOptions.map(opt => (
                      <div
                        key={opt.value}
                        style={{ padding: '8px 16px', cursor: 'pointer', background: sortOption === opt.value ? '#f3f4f6' : '#fff' }}
                        onClick={() => { setSortOption(opt.value); setSortDropdownOpen(false); }}
                      >
                        {opt.label}
                      </div>
                    ))}
                    {sortOption !== 'recent-oldest' && (
                      <div
                        style={{ padding: '8px 16px', cursor: 'pointer', color: '#ef4444', fontWeight: 500, borderTop: '1px solid #eee' }}
                        onClick={() => { setSortOption('recent-oldest'); setSortDropdownOpen(false); }}
                      >
                        Clear Sorting
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {loading ? (
            <div>Loading orders...</div>
          ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Payment Status</th>
                <th>Delivery Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.order_number?.replace(/^#/, '')}</td>
                  <td>{order.personal_info?.first_name} {order.personal_info?.last_name}</td>
                  <td>{order.personal_info?.email}</td>
                  <td>{order.amount}</td>
                  <td>{order.currency}</td>
                  <td>{order.payment_info?.status}</td>
                  <td>{order.delivery_info?.status}</td>
                  <td>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</td>
                  <td>
                    <button className="create-bundle-btn" style={{ background: '#f59e0b', minWidth: 80, fontSize: 13, padding: '0.4rem 1rem' }} onClick={() => handleEditClick(order)}>
                      Edit Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          <div className="pagination">
            <div className="pagination-info">
              SHOWING {searchedOrders.length === 0 ? 0 : ((currentPage - 1) * ORDERS_PER_PAGE + 1)}
              {searchedOrders.length > 0 ? `-${Math.min(currentPage * ORDERS_PER_PAGE, searchedOrders.length)}` : ''}
              {` OF ${searchedOrders.length} RESULTS`}
            </div>
            <div className="pagination-buttons">
              <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-btn${currentPage === idx + 1 ? ' active' : ''}`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Status Modal */}
      {showEdit && editOrder && (
        <div className="product-modal-overlay">
          <div className="product-modal-content" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowEdit(false)}
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
            <h2>Edit Order Status</h2>
            <div style={{ fontSize: '0.92rem', color: '#6b7280', marginBottom: 10, wordBreak: 'break-all' }}>
              <strong>Order ID:</strong> {editOrder._id}
            </div>
            <form onSubmit={handleUpdateStatus} className="product-modal-form">
              <label>
                Payment Status:
                <select name="paymentStatus" value={editPaymentStatus} onChange={e => setEditPaymentStatus(e.target.value)} className="input">
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </label>
              <label>
                Delivery Status:
                <select name="deliveryStatus" value={editDeliveryStatus} onChange={e => setEditDeliveryStatus(e.target.value)} className="input">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
    </div>
  );
};

export default Orders;