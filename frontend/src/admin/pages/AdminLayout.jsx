import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../component/AdminSidebar';
import { Menu } from 'lucide-react';
import { useUser } from '../../Context/UserContext';
import AdminFooter from './AdminFooter';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useUser();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Content area */}
      <div className="flex flex-col flex-1 relative max-h-screen">
        {/* Hamburger menu */}
        <button
          className="md:hidden p-2 text-gray-700 fixed top-4 left-4 z-30 bg-white rounded-md shadow"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Page Content (Outlet) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminLayout;
