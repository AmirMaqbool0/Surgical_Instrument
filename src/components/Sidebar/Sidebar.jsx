import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Settings as SettingsIcon,
  MessageCircle
} from 'lucide-react';
import './style.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Products', icon: Package, path: '/products' },
    { label: 'Bundles', icon: Boxes, path: '/bundles' },
    { label: 'Orders', icon: ShoppingBag, path: '/orders' },
    { label: 'Communication', icon: MessageCircle, path: '/communication' },
    { label: 'Settings', icon: SettingsIcon, path: '/settings' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span className="logo-text">logo ipsum</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`nav-link flat ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={20} style={{ marginRight: 12 }} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
