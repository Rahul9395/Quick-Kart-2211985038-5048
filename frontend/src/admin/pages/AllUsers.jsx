import React, { useEffect, useState } from "react";
import { useAdmin } from "../../Context/AdminContext";
import { useUser } from "../../Context/UserContext"; 
import { Link } from "react-router-dom";
import { User, Search } from "lucide-react";

function AllUsers() {
  const { AllUsers, getAllUsers } = useAdmin();
  const { user: currentUser } = useUser();

  const [searchQuery, setSearchQuery] = useState("");


  // 🔍 Filter users by name or email
  const filteredUsers = AllUsers?.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>

        {/* Search bar */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isCurrentUser = currentUser && currentUser._id === user._id;

            return (
              <Link
                key={user._id}
                to={`/admin/users/${user._id}/profile`}
                className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow relative"
              >
                {/* Mark Your Profile */}
                {isCurrentUser && (
                  <span className="absolute top-2 right-2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    Your Profile
                  </span>
                )}

                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={28} className="text-gray-400" />
                    )}
                  </div>

                  {/* Name + Email */}
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}

export default AllUsers;
