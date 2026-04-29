

import React, { useState, useRef } from "react";
import { useUser } from "../Context/UserContext";
import { useAdmin } from "../Context/AdminContext";
import {
    User,
    Camera,
    MapPin,
    Mail,
    Package,
    Heart,
    Calendar,
    Shield,
    Edit3,
    Save,
    X,
    Phone,
} from "lucide-react";

function Profile() {
    const { user, updatedAddress, uploadProfileImage } = useUser();
    const { uploadImageToCloudinary } = useAdmin();

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const fileInputRef = useRef(null);

    // Address form state
    const [addressForm, setAddressForm] = useState({
        houseName: user?.address?.houseName || "",
        landmark: user?.address?.landmark || "",
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zip: user?.address?.zip || "",
        country: user?.address?.country || "India",
        phone: user?.address?.phone || "",
    });

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            const { imageUrl, public_id } = await uploadImageToCloudinary(file);
            await uploadProfileImage({
                url: imageUrl,
                public_id,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleAddressSave = async () => {
        try {
            await updatedAddress(addressForm);
            setIsEditingAddress(false);
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4 space-y-10">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 h-36 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                {/* Profile Image */}
                                <div
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white cursor-pointer hover:scale-105 transition-transform"
                                    onClick={() => setIsImageModalOpen(true)}
                                >
                                    {user.avatar?.url ? (
                                        <img
                                            src={user.avatar.url}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <User size={40} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Upload button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="absolute bottom-2 right-2 w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                >
                                    {isUploadingImage ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Camera size={16} />
                                    )}
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8">
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-gray-600 flex items-center mt-2">
                            <Mail size={18} className="mr-2" />
                            {user.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <span
                                className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${user.role === "admin"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                <Shield size={14} />
                                {user.role === "admin" ? "Administrator" : "Customer"}
                            </span>
                            <span className="text-gray-500 text-sm flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Package size={28} className="text-blue-600" />,
                            label: "Total Orders",
                            value: user.orderHistory?.length || 0,
                            bg: "bg-blue-50",
                        },
                        {
                            icon: <Heart size={28} className="text-red-600" />,
                            label: "Wishlist",
                            value: user.wishlist?.length || 0,
                            bg: "bg-red-50",
                        },
                        {
                            icon: <Package size={28} className="text-purple-600" />,
                            label: "Cart Items",
                            value: user.cart?.length || 0,
                            bg: "bg-purple-50",
                        },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center">
                                <div
                                    className={`w-14 h-14 ${stat.bg} rounded-lg flex items-center justify-center`}
                                >
                                    {stat.icon}
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Address Section */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <MapPin size={20} className="mr-2 text-blue-500" />
                            Address
                        </h2>
                        {isEditingAddress ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddressSave}
                                    className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg flex items-center gap-1 hover:bg-blue-600"
                                >
                                    <Save size={14} /> Save
                                </button>
                                <button
                                    onClick={() => setIsEditingAddress(false)}
                                    className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg flex items-center gap-1 hover:bg-gray-200"
                                >
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditingAddress(true)}
                                className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg flex items-center gap-1 hover:bg-gray-200"
                            >
                                <Edit3 size={14} /> Edit
                            </button>
                        )}
                    </div>

                    {isEditingAddress ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {Object.keys(addressForm).map((key) => (
                                <input
                                    key={key}
                                    type="text"
                                    placeholder={key}
                                    value={addressForm[key]}
                                    onChange={(e) =>
                                        setAddressForm({ ...addressForm, [key]: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>
                    ) : user.address ? (
                        <div className="space-y-2 text-gray-700 text-lg">
                            <p>
                                {user.address.houseName}, {user.address.street},{" "}
                                {user.address.city}
                            </p>
                            <p>
                                {user.address.state}, {user.address.zip},{" "}
                                {user.address.country}
                            </p>
                            <p className="flex items-center">
                                <Phone size={16} className="mr-2 text-gray-500" />
                                {user.address.phone}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No address added</p>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div
                        className="relative max-w-2xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking on the image itself
                    >
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-3 right-3 bg-black bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 transition"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={user.avatar?.url}
                            alt={user.name}
                            className="w-full h-auto rounded-lg shadow-2xl animate-[zoomIn_0.3s_ease]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
