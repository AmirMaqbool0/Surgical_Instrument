import React from "react";
import "./style.css";
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
     
        <div className="footer-section about">
          <img src="logo.png" alt="Logo" className="footer-logo" />
          <p className="detail">
            When you need quality instrumentation at affordable prices, turn to
            gSource—your go-to surgical shop. We are a reliable industry partner
            with over 20 years of experience providing surgical supplies.
          </p>
          <div className="contact-info">
            <p>
              <MapPin size={20} /> 4910 N. Chestnut Ave. OF 45 Fresno, CA 93726
            </p>
            <p>
              <Phone size={20} /> (+92) 1111111111
            </p>
            <p>
              <Mail size={20} /> Surgical@example.com
            </p>
          </div>
        </div>

        {/* Product Information */}
        <div className="footer-section">
          <h4>Product Information</h4>
          <ul>
            <li>Evaluation samples</li>
            <li>About our products</li>
            <li>Quality policy</li>
            <li>Return policy</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li>Catalog and Brochure</li>
            <li>Trade show schedule</li>
            <li>Company news</li>
          </ul>
        </div>

        {/* Instruments */}
        <div className="footer-section">
          <h4>Instruments</h4>
          <ul>
            <li>Custom instruments</li>
            <li>All instruments</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>Copyright © 2025. All Rights Reserved.</p>
        <div className="social-icons">
          <Facebook size={18} />
          <Twitter size={18} />
          <Linkedin size={18} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
