import React from 'react';
import './style.css';

const Manufacturer = () => {
  const salesData = {
    equipment: 60,
    clothing: 30,
    other: 10,
  };

  const newsData = [
    { date: 'May 28, 2025', title: 'New Order #AN230965', customer: 'Elias Hermann', amount: '$645.00' },
    { date: 'May 27, 2025', title: 'New Order #AN230965', customer: 'Dustin Munoz', amount: '$310.00' },
    { date: 'May 27, 2025', title: 'New Order #AN230965', customer: 'Lula White', amount: '$962.00' },
  ];

  const orderData = [
    { id: '#YU32363', amount: '$646.00', payment: 'Visa Card', date: 'May 28, 2025', status: 'New' },
    { id: '#YU1875', amount: '$297.00', payment: 'Paypal', date: 'May 28, 2025', status: 'Completed' },
    { id: '#YU0375', amount: '$750.00', payment: 'Visa Card', date: 'May 28, 2025', status: 'In Progress' },
    { id: '#YB95363', amount: '$646.00', payment: 'Mastercard', date: 'May 28, 2025', status: 'Completed' },
    { id: '#YU0163', amount: '$460.00', payment: 'Visa Card', date: 'May 28, 2025', status: 'New' },
    { id: '#YU1562', amount: '$750.00', payment: 'Mastercard', date: 'May 28, 2025', status: 'In Progress' },
    { id: '#YU06063', amount: '$804.00', payment: 'Visa Card', date: 'May 28, 2025', status: 'New' },
  ];

  const bestsellingProducts = [
    { id: '523846', name: "S'Retractor 5 1/4\"", price: '$610.00' },
    { id: '129846', name: "S'Retractor 5 1/4\"", price: '$45.00' },
    { id: '128945', name: "S'Retractor 5 1/4\"", price: '$771.00' },
    { id: '127950', name: "S'Retractor 5 1/4\"", price: '$533.00' },
  ];

  const offerBundles = [
    { name: 'Knee Surgery Equipment', category: 'CATEGORY: PREDEFINED BUNDLES', price: '$7150' },
    { name: 'Brain Surgery Equip', category: 'CATEGORY: PREDEFINED', price: '$4250'},
    // { name: 'Brain Surgery Equip', category: 'CATEGORY: PREDEFINED', price: '$4250'},
    // { name: 'Knee Surgery Equipment', category: 'CATEGORY: PREDEFINED BUNDLES', price: '$7150' },
  ];

  return (
    <div className="manufacturer-container">
      <div className="dashboard-layout">
        <div className="main-section">
          <div className="top-row">
            <div className="card sales-card">
              <h3>
                Sales by Category <select><option>Week</option></select>
              </h3>
              <div className="sales-chart">
                <svg width="200" height="200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#E0E7FF" strokeWidth="20" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#F59E0B" strokeWidth="20" strokeDasharray="188 413" transform="rotate(-90 100 100)" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="94 507" transform="rotate(-90 100 100)" />
                </svg>
                <div className="legend">
                  <span>Other</span><span className="color-box" style={{ background: '#F59E0B' }}></span>
                  <span>Equipment</span><span className="color-box" style={{ background: '#10B981' }}></span>
                  <span>Clothing</span><span className="color-box" style={{ background: '#3B82F6' }}></span>
                </div>
              </div>
            </div>
            <div className="card news-card">
              <h3>
                News <select><option>Recent first</option></select>
              </h3>
              <ul>
                {newsData.map((item, index) => (
                  <li key={index}>
                    <span className="news-dot"></span>
                    <div>
                      <p>{item.date}</p>
                      <p>{item.title} - Customer: {item.customer} - Amount: {item.amount}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card order-list-card">
            <h3>Order List</h3>
            <table>
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>AMOUNT</th>
                  <th>PAYMENT METHOD</th>
                  <th>ORDER DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {orderData.map((order, index) => (
                  <tr key={index}>
                    <td>{order.id}</td>
                    <td>{order.amount}</td>
                    <td>{order.payment}</td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="side-section">
          <div className="card bestselling-card">
            <h3>
              Bestselling products <select><option>Week</option></select>
            </h3>
            <ul>
              {bestsellingProducts.map((product, index) => (
                <li key={index} className="bestselling-item">
                  <div className="product-image-container">
                    <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="product-image" />
                  </div>
                  <div className="product-details">
                    <div className="product-info">
                      <p className="product-name">{product.name}</p>
                      <p className="product-price">{product.price}</p>
                    </div>
                    <p className="product-id">PRODUCT ID: {product.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
         
          <div className="card offer-bundles-card">
            <h3>Latest Offer Bundles</h3>
            <div className="bundle-container">
              {offerBundles.map((bundle, index) => (
                <div key={index} className="bundle-item">
                  <img src={`https://via.placeholder.com/100x100?text=${encodeURIComponent(bundle.name)}`} alt={bundle.name} className="bundle-image" />
                  <div className="bundle-details">
                    <p className="bundle-name">{bundle.name}</p>
                    <p className="bundle-category">{bundle.category}</p>
                    <p className="bundle-price">
                      {bundle.price} {bundle.discount && <span className="discount-badge">{bundle.discount}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Manufacturer;