import React, { useState } from 'react';
import { useUser } from '../Context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function AddressSection() {
  const { user, token, setUser, updatedAddress } = useUser();

  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState(user?.address || {});

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const success = await updatedAddress(address);
    if (success) {
      toast.success('Address Add')
      setEditMode(false);
    }

  };

  const renderInput = (label, name, value) => (
    <div className="w-full md:w-1/2 px-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-md p-4 md:p-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Delivery Address</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <div className="flex flex-wrap -mx-2">
          {renderInput('House Name', 'houseName', address.houseName)}
          {renderInput('Landmark', 'landmark', address.landmark)}
          {renderInput('Street', 'street', address.street)}
          {renderInput('City', 'city', address.city)}
          {renderInput('State', 'state', address.state)}
          {renderInput('Zip Code', 'zip', address.zip)}
          {renderInput('Country', 'country', address.country || 'India')}
          {renderInput('Phone', 'phone', address.phone)}

          <div className="w-full px-2 mt-4 flex gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : user?.address?.houseName ? (
        <div className="text-gray-700 text-sm md:text-base leading-relaxed">
          <p>{user.address.houseName}, {user.address.landmark}</p>
          <p>{user.address.street}</p>
          <p>{user.address.city}, {user.address.state} - {user.address.zip}</p>
          <p>{user.address.country}</p>
          <p>Phone: {user.address.phone}</p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No address found. Please add one.</p>
      )}
    </div>
  );
}

export default AddressSection;
