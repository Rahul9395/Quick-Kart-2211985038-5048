import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, UserCircle, Package, LogOut, ChevronDown } from "lucide-react";
import { useUser } from "../Context/UserContext";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useUser();
  const menuRef = useRef(null);
  const closeTimeout = useRef(null);
  const navigate = useNavigate();

  // Logout handler
  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Desktop hover logic
  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      clearTimeout(closeTimeout.current);
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      closeTimeout.current = setTimeout(() => {
        setOpen(false);
      }, 200);
    }
  };

  return (
    <div
      ref={menuRef}
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Account Button */}
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)} // Mobile toggle
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <span className="text-sm font-medium">My Account</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden transform transition-all duration-200 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* User Info */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
          >
            <UserCircle
              size={18}
              className="text-gray-400 group-hover:text-blue-500 transition-colors"
            />
            <div>
              <span className="text-sm font-medium">Profile Settings</span>
              <p className="text-xs text-gray-500">Manage your account</p>
            </div>
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
          >
            <Package
              size={18}
              className="text-gray-400 group-hover:text-blue-500 transition-colors"
            />
            <div>
              <span className="text-sm font-medium">Order History</span>
              <p className="text-xs text-gray-500">View past purchases</p>
            </div>
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-gray-100 py-2">
          <button
            onClick={handleLogOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 group"
          >
            <LogOut
              size={18}
              className="text-red-400 group-hover:text-red-600 transition-colors"
            />
            <div className="text-left">
              <span className="text-sm font-medium">Sign Out</span>
              <p className="text-xs text-red-400">End your session</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
