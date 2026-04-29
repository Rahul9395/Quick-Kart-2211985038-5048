import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-4 w-full mt-5 border-t">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-sm text-center">
        <p className="mb-1">© {new Date().getFullYear()} QuickKart Admin Panel</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
};

export default AdminFooter;
