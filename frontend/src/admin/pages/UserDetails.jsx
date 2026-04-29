



import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Mail,
    Shield,
    Package,
    MapPin,
    User as UserIcon,
    Crown,
    UserCheck,
    Trash2
} from "lucide-react";
import { useAdmin } from "../../Context/AdminContext";

function UserDetails() {
    const { id } = useParams(); // userId from route
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [updatingRole, setUpdatingRole] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // from AdminContext
    const { url, user: adminUser, token } = useAdmin();

    const isSelf = useMemo(() => adminUser?._id === id, [adminUser, id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoadingUser(true);
                const { data } = await axios.get(`${url}/api/users/get-user-by-id/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUser();
    }, [id, url, token]);

    const handleRoleChange = async (nextRole) => {
        if (!user) return;
        if (isSelf) {
            alert("❌ You cannot change your own role.");
            return;
        }
        if (user.role === nextRole) return;

        const ok = confirm(`Are you sure you want to make this user ${nextRole}?`);
        if (!ok) return;

        try {
            setUpdatingRole(true);
            const { data } = await axios.put(
                `${url}/api/users/${user._id}/role`,
                { role: nextRole },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
            if (data?.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update role. Please try again.");
        } finally {
            setUpdatingRole(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!user) return;
        if (isSelf) {
            alert("❌ You cannot delete your own account.");
            return;
        }

        const ok = confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`);
        if (!ok) return;

        try {
            setDeleting(true);
            await axios.delete(`${url}/api/users/${user._id}/delete`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            alert("✅ User deleted successfully.");
            navigate("/admin/users"); // redirect to all users page
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    if (loadingUser) {
        return <p className="p-6 text-gray-500">Loading user details...</p>;
    }

    if (!user) {
        return <p className="p-6 text-gray-500">User not found.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
                {/* Header: Avatar + Name + Email + Role */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
                            {user.avatar?.url ? (
                                <img
                                    src={user.avatar.url}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon size={56} className="text-gray-400" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="flex items-center text-gray-600">
                                <Mail size={16} className="mr-2" /> {user.email}
                            </p>
                            <p
                                className={`mt-2 px-3 py-1 inline-flex items-center rounded-full text-sm font-medium ${user.role === "admin"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                            >
                                <Shield size={14} className="mr-1" />
                                {user.role === "admin" ? "Administrator" : "Customer"}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleRoleChange("admin")}
                            disabled={updatingRole || isSelf || user.role === "admin"}
                            className="px-3 py-2 rounded-lg border text-sm inline-flex items-center gap-2 transition bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Crown size={16} /> Make Admin
                        </button>
                        <button
                            onClick={() => handleRoleChange("customer")}
                            disabled={updatingRole || isSelf || user.role === "customer"}
                            className="px-3 py-2 rounded-lg border text-sm inline-flex items-center gap-2 transition bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <UserCheck size={16} /> Make Customer
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            disabled={deleting || isSelf}
                            className="px-3 py-2 rounded-lg border text-sm inline-flex items-center gap-2 transition bg-red-50 border-red-200 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={16} /> Delete User
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="font-semibold text-gray-800 flex items-center mb-3">
                        <Package size={18} className="mr-2 text-blue-500" /> Orders
                    </h2>
                    {Array.isArray(user.orderHistory) && user.orderHistory.length > 0 ? (
                        <div className="space-y-4">
                            {user.orderHistory.map((order) => (
                                <div
                                    key={order._id || order.id}
                                    className="border rounded-lg p-4 bg-gray-50"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">
                                                Order #{(order._id || order.id || "").slice(-6)}
                                            </span>{" "}
                                            • {order.status || "Placed"} •{" "}
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleString()
                                                : "Date N/A"}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {typeof order.totalAmount === "number"
                                                ? `₹${order.totalAmount.toFixed(2)}`
                                                : "Total N/A"}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    {Array.isArray(order.items) && order.items.length > 0 ? (
                                        <ul className="mt-3 space-y-3">
                                            {order.items.map((it, idx) => (
                                                <li
                                                    key={it._id || idx}
                                                    className="flex items-center justify-between text-sm border rounded-lg bg-white p-2"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                                            {it.image ? (
                                                                <img
                                                                    src={it.image}
                                                                    alt={it.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                                    No Img
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-800 font-medium">{it.name}</p>
                                                            <p className="text-gray-500">× {it.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-gray-700 font-medium">
                                                        {typeof it.price === "number"
                                                            ? `₹${it.price.toFixed(2)}`
                                                            : ""}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-2 text-sm text-gray-500">
                                            No items found for this order.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No orders found.</p>
                    )}
                </div>


                {/* Address */}
                <div className="mt-8">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                        <MapPin size={18} className="mr-2 text-blue-500" /> Address
                    </h2>
                    {user.address ? (
                        <div className="text-gray-700 mt-2">
                            <p>
                                {user.address.houseName || ""}{" "}
                                {user.address.street ? `, ${user.address.street}` : ""}{" "}
                                {user.address.city ? `, ${user.address.city}` : ""}
                            </p>
                            <p>
                                {user.address.state || ""}{" "}
                                {user.address.zip ? `, ${user.address.zip}` : ""}{" "}
                                {user.address.country ? `, ${user.address.country}` : ""}
                            </p>
                            {user.address.phone && <p>Phone: {user.address.phone}</p>}
                        </div>
                    ) : (
                        <p className="text-gray-500">No address available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetails;
