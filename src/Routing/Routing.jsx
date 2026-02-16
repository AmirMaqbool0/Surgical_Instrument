import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header, Sidebar, Login, ProtectedRoute } from "../components";
import { Dashboard, Orders, Products, Settings, Manufacturer, CreateBundle, Bundles, ProductDetail, CreateProduct, Communication } from "../screens";
import { useAuth } from '../AuthContext';
import '../App.css'

const Routing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const { token } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className={`app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {token && (
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        )}
        <div className="main-content">
          {token && (
            <Header
              toggleSidebar={toggleSidebar}
            />
          )}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/products/:id" element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } />
            <Route path="/products/create" element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            {/* <Route path="/manufacturer" element={<Manufacturer />} /> */}
            <Route path="/bundles" element={
              <ProtectedRoute>
                <Bundles />
              </ProtectedRoute>
            } />
            <Route path="/bundles/create" element={
              <ProtectedRoute>
                <CreateBundle />
              </ProtectedRoute>
            } />
            <Route path="/communication" element={
              <ProtectedRoute>
                <Communication />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default Routing;
