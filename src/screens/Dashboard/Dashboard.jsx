import React, { useEffect, useState } from "react";
import "./style.css";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";
import { Header } from "../../components";
import {
  FaDollarSign,
  FaBox,
  FaFileInvoice,
  FaUsers,
} from "react-icons/fa";
import ProductImage from "../../assets/product.png";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const statCardStatics = [
  {
    title: "Total Sales",
    icon: <FaBox />,
    color: "#22c55e",
    stroke: "#22c55e",
    gradientId: "salesGradient",
  },
  {
    title: "Total Income",
    icon: <FaDollarSign />,
    color: "#f97316",
    stroke: "#f97316",
    gradientId: "incomeGradient",
  },
  {
    title: "Orders Paid",
    icon: <FaFileInvoice />,
    color: "#9ca3af",
    stroke: "#9ca3af",
    gradientId: "ordersGradient",
  },
  {
    title: "Total Visitor",
    icon: <FaUsers />,
    color: "#3b82f6",
    stroke: "#3b82f6",
    gradientId: "visitorGradient",
  },
];

const Dashboard = () => {
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [statCardValues, setStatCardValues] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recentOrderData, setRecentOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProducts, setModalProducts] = useState([]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    setLoading(true);
    const safeFetch = (url) =>
      fetch(url)
        .then((res) => (res.ok ? res.json() : Promise.resolve([])))
        .catch(() => []);

    // Only one fetch for dashboard stats and monthly breakdown
    const fetchStats = fetch(`${baseUrl}/v1/admin/order/dashboard`)
      .then((res) => (res.ok ? res.json() : Promise.resolve({ data: {} })))
      .catch(() => ({ data: {} }));

    Promise.all([
      fetchStats
    ])
      .then(([statsRes]) => {
        setStatCardValues(statsRes.data.periodTotals || {});
        setMonthlyBreakdown(statsRes.data.monthlyBreakdown || []);
        setTopProducts(statsRes.data.topProducts || []);
        setOrders(statsRes.data.orderDetails || []);
        // Prepare recent order graph data (Jan-Dec, totalOrders)
        const breakdownByMonthNumber = {};
        (statsRes.data.monthlyBreakdown || []).forEach((item) => {
          breakdownByMonthNumber[item.monthNumber] = item;
        });
        const graphData = months.map((month, idx) => {
          const item = breakdownByMonthNumber[idx + 1];
          return {
            name: month.slice(0, 3),
            value: item ? item.totalOrders : 0,
          };
        });
        setRecentOrderData(graphData);
      })
      .finally(() => setLoading(false));
  }, []);

  // Modal component for products
  const ProductsModal = ({ open, products, onClose }) => {
    if (!open) return null;
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>Order Products</h3>
          <table className="products-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ padding: '8px', textAlign: 'left', color: '#6b7280', fontWeight: 500 }}>Product Name</th>
                <th style={{ padding: '8px', textAlign: 'center', color: '#6b7280', fontWeight: 500 }}>Quantity</th>
                <th style={{ padding: '8px', textAlign: 'center', color: '#6b7280', fontWeight: 500 }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px', color: '#111827' }}>{prod.name}</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#111827' }}>{prod.quantity}</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#111827' }}>${prod.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ marginTop: '1rem', float: 'right' }} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="products-wrapper">
        <div className="dash-board-content">
          <h1 className="page-title" style={{ marginBottom: 24 }}>Dashboard</h1>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="card-grid">
                {statCardStatics.map((card, index) => {
                  let value = "--";
                  if (index === 0) value = statCardValues.totalOrders ?? "--";
                  else if (index === 1)
                    value =
                      statCardValues.totalIncome !== undefined
                        ? `$${Number(statCardValues.totalIncome).toFixed(2)}`
                        : "--";
                  else if (index === 2)
                    value = statCardValues.paidOrders ?? "--";
                  else if (index === 3)
                    value = statCardValues.totalVisitor ?? 0;

                  let chartData = months.map((month, idx) => {
                    const item = monthlyBreakdown.find((m) => m.monthNumber === idx + 1);
                    if (index === 0) {
                      // Total Sales: sales per month
                      return { name: month, value: item ? item.totalOrders : 0 };
                    } else if (index === 1) {
                      // Total Income: income per month
                      return { name: month, value: item ? item.totalIncome : 0 };
                    } else if (index === 2) {
                      // Orders Paid: paid orders per month
                      return { name: month, value: item ? item.paidOrders : 0 };
                    } else if (index === 3) {
                      // Number of Visitors: income per month (as per your logic)
                      return { name: month, value: item ? item.totalIncome : 0 };
                    }
                    return { name: month, value: 0 };
                  });

                  return (
                    <div className="stat-card-new" key={index}>
                      <div className="stat-header">
                        <div
                          className="icon-hex"
                          style={{ backgroundColor: card.color }}
                        >
                          {card.icon}
                        </div>
                        <div className="stat-text">
                          <span className="stat-title">{card.title}</span>
                          <span className="stat-value">{value}</span>
                        </div>
                      </div>
                      <div className="mini-chart">
                        <ResponsiveContainer width="100%" height={40}>
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient
                                id={card.gradientId}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor={card.stroke}
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={card.stroke}
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={card.stroke}
                              fill={`url(#${card.gradientId})`}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="recent-orders">
                <div className="section-title">Recent Order</div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={recentOrderData || []}>
                    <defs>
                      <linearGradient
                        id="recentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fill="url(#recentGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products and Orders Section */}
              <div className="bottom-section">
                <div className="top-products">
                  <div className="section-header">
                    <span>Top Products</span>
                  </div>
                  <div className="top-products-table-head" style={{ display: 'flex', fontWeight: 500, color: '#6b7280', marginBottom: 10 }}>
                    <div style={{ flex: 2 }}>Product</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Sold</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Orders</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Revenue</div>
                  </div>
                  {topProducts &&
                    topProducts.map((product, idx) => (
                      <div className="top-product-item" key={product._id || idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={ProductImage} alt="product" style={{ width: 40, height: 40, background: '#f1f5f9', borderRadius: 8 }} />
                          <span className="name">{product.productName}</span>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>{product.totalQuantitySold}</div>
                        <div style={{ flex: 1, textAlign: 'center' }}>{product.orderCount}</div>
                        <div style={{ flex: 1, textAlign: 'center' }}>${product.totalRevenue?.toFixed(2) ?? '0.00'}</div>
                      </div>
                    ))}
                </div>

                <div className="orders-table" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <div className="section-header">
                    <span>Orders</span>
                  </div>
                  <div className="table-head">
                    <div>Order ID</div>
                    <div>Date</div>
                    <div>Products</div>
                    <div>Sub-total</div>
                    <div>Final Amount</div>
                    <div>Payment Status</div>
                    <div>Delivery Status</div>
                    <div>Action</div>
                  </div>
                  {orders &&
                    orders.map((order, idx) => (
                      <div className="table-row" key={idx}>
                        <div>{order.orderNumber ? order.orderNumber.replace(/^#/, '') : '--'}</div>
                        <div>{new Date(order.date).toLocaleDateString()}</div>
                        <div>{order.products.length}</div>
                        <div>{order.originalAmount !== undefined ? `$${order.originalAmount.toFixed(2)}` : '--'}</div>
                        <div>{order.finalAmount !== undefined ? `$${order.finalAmount.toFixed(2)}` : '--'}</div>
                        <div>{order.paymentStatus || '--'}</div>
                        <div>{order.deliveryStatus || '--'}</div>
                        <div>
                          <button
                            onClick={() => {
                              setModalProducts(order.products);
                              setModalOpen(true);
                            }}
                          >
                            View Products
                          </button>
                        </div>
                      </div>
                    ))}
                  <ProductsModal
                    open={modalOpen}
                    products={modalProducts}
                    onClose={() => setModalOpen(false)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
