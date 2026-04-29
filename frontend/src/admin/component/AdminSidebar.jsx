import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Folders,
  Package,
  Users,
  BarChart,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  LogOut,
  ClipboardList,
  UserCircle,
  Home 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon, text, children, to }) => {
  const location = useLocation();
  const hasChildren = React.Children.count(children) > 0;
  const [isOpen, setIsOpen] = useState(false);

  // Auto open dropdown if any of its child links match current path
  useEffect(() => {
    if (hasChildren) {
      const isAnyChildActive = React.Children.toArray(children).some(child => {
        return location.pathname === child.props.to;
      });
      setIsOpen(isAnyChildActive);
    }
  }, [location.pathname, children]);

  const toggleDropdown = () => {
    if (hasChildren) setIsOpen(!isOpen);
  };

  const isActive = to && location.pathname === to;

  if (to) {
    return (
      <li>
        <Link
          to={to}
          className={`flex items-center p-3 text-sm transition-colors duration-300 rounded-md
            ${isActive ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-700'}
          `}
        >
          {icon && <span className="mr-3 text-lg">{icon}</span>}
          <span>{text}</span>
        </Link>
      </li>
    );
  }

  return (
    <li className="relative">
      <div
        className={`flex items-center p-3 cursor-pointer text-sm transition-colors duration-300 rounded-md
          ${isOpen ? 'bg-gray-700 text-white' : 'text-gray-200 hover:bg-gray-700'}
        `}
        onClick={toggleDropdown}
      >
        {icon && <span className="mr-3 text-lg">{icon}</span>}
        <span className="flex-grow">{text}</span>
        {hasChildren && (
          <span className="w-5 h-5 transition-transform duration-300">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </span>
        )}
      </div>
      {hasChildren && (
        <ul
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
            isOpen ? 'max-h-screen' : 'max-h-0'
          } bg-gray-800 rounded-md mt-1`}
        >
          {children}
        </ul>
      )}
    </li>
  );
};

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <div
      className={`
        w-64 bg-gray-900 text-gray-200 h-screen shadow-lg p-5 rounded-r-lg
        fixed inset-y-0 left-0 transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:rounded-none flex flex-col
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-wide">QuickKart Admin</h2>
        <button className="md:hidden text-gray-400 hover:text-white" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          <SidebarItem icon={<Home size={20} />} text="Home" to="/" />
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" to="/admin/dashboard" />

          <SidebarItem icon={<Folders size={20} />} text="Categories">
            <li>
              <Link
                to="/admin/add-category"
                className={`block py-2 pl-10 pr-3 text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === '/admin/add-category' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                Add Category
              </Link>
            </li>
            <li>
              <Link
                to="/admin/view-categories"
                className={`block py-2 pl-10 pr-3 text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === '/admin/view-categories' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                View Categories
              </Link>
            </li>
          </SidebarItem>

          <SidebarItem icon={<Package size={20} />} text="Inventory">
            <li>
              <Link
                to="/admin/add-item"
                className={`block py-2 pl-10 pr-3 text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === '/admin/add-item' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                Add Item
              </Link>
            </li>
            <li>
              <Link
                to="/admin/view-product"
                className={`block py-2 pl-10 pr-3 text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === '/admin/view-by-category' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                View Products
              </Link>
            </li>
          </SidebarItem>

          <SidebarItem icon={<ClipboardList size={20} />} text="Orders">
            {/* <li>
              <Link
                to="/admin/orders/pending"
                className={`block py-2 pl-10 pr-3 text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === '/admin/orders/pending' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                Pending Orders
              </Link>
            </li> */}
            <li>
              <Link
                to="/admin/orders/history"
                className={`block py-2 pl-10 pr-3 text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === '/admin/orders/history' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                Order History
              </Link>
            </li>
          </SidebarItem>

          <SidebarItem icon={<UserCircle size={20} />} text="Profile">
            <li>
              <Link
                to="/admin/profile"
                className={`block py-2 pl-10 pr-3 text-sm rounded-md transition-colors duration-200 ${
                  location.pathname === '/admin/profile' ? 'bg-gray-700 text-white' : 'hover:bg-gray-700'
                }`}
              >
                View Profile
              </Link>
            </li>
          </SidebarItem>

          <SidebarItem icon={<Users size={20} />} text="Users" to="/admin/users" />
          <SidebarItem icon={<BarChart size={20} />} text="Reports" to="/admin/reports" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" to="/admin/settings" />
          

        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
            window.location.href = '/';
          }}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
        >
          <LogOut className="mr-2" size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
