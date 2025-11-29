import { React, html } from "/src/utils/htm.js";
import { useState, useEffect } from "react";
import api from "/src/utils/api.js";
import { useNavigate } from "https://esm.sh/react-router-dom@6.16.0?external=react,react-dom";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    // Filter and sort users
    let filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "created_at" || sortField === "last_login_at") {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, sortField, sortDirection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/admin/stats")
      ]);

      if (usersRes.users) setUsers(usersRes.users);
      if (statsRes) setStats(statsRes);
    } catch (err) {
      setError("Failed to load admin data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Madrid'
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await api.put(`/api/admin/users/${editingUser.id}`, {
        username: editingUser.username,
        coins: parseInt(editingUser.coins),
        total_points: parseInt(editingUser.total_points),
        role: editingUser.role
      });
      setEditingUser(null);
      fetchData();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/api/admin/users/${userId}`);
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return html`<span className="text-gray-600">⇅</span>`;
    return html`<span className="text-warmRed">${sortDirection === "asc" ? "↑" : "↓"}</span>`;
  };

  if (loading) return html`<div className="text-center mt-20 text-white">Loading admin dashboard...</div>`;
  if (error) return html`<div className="text-center mt-20 text-red-500">${error}</div>`;

  return html`
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-warmRed">🛡️ Admin Dashboard</h1>
        <button onClick=${fetchData} className="text-gray-400 hover:text-white">🔄 Refresh</button>
      </div>

      <!-- Stats Cards -->
      ${stats && html`
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800">
            <div className="text-gray-400 text-sm uppercase">Total Users</div>
            <div className="text-3xl font-bold text-white">${stats.total_users}</div>
          </div>
          <div className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800">
            <div className="text-gray-400 text-sm uppercase">Total Quizzes</div>
            <div className="text-3xl font-bold text-blue-400">${stats.total_quizzes}</div>
          </div>
          <div className="bg-[#1f1f27] p-6 rounded-lg border border-gray-800">
            <div className="text-gray-400 text-sm uppercase">Total Points Awarded</div>
            <div className="text-3xl font-bold text-warmRed">${stats.total_points}</div>
          </div>
        </div>
      `}

      <!-- Search Bar -->
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by username or email..."
          value=${searchTerm}
          onChange=${e => setSearchTerm(e.target.value)}
          className="w-full bg-[#1f1f27] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-warmRed outline-none"
        />
      </div>

      <!-- Users Table -->
      <div className="bg-[#1f1f27] rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">User Accounts (${filteredUsers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#262633] text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">PFP</th>
                <th className="px-4 py-3 cursor-pointer hover:text-white" onClick=${() => handleSort("id")}>
                  ID <${SortIcon} field="id" />
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-white" onClick=${() => handleSort("username")}>
                  Username <${SortIcon} field="username" />
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-white" onClick=${() => handleSort("email")}>
                  Email <${SortIcon} field="email" />
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-white" onClick=${() => handleSort("role")}>
                  Role <${SortIcon} field="role" />
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-white" onClick=${() => handleSort("created_at")}>
                  Created <${SortIcon} field="created_at" />
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-white" onClick=${() => handleSort("last_login_at")}>
                  Last Login <${SortIcon} field="last_login_at" />
                </th>
                <th className="px-4 py-3">Last IP</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              ${filteredUsers.map(user => html`
                <tr key=${user.id} className="hover:bg-[#262633] transition-colors">
                  <td className="px-4 py-3">
                    ${(() => {
      const pfp = user.profile_picture;
      if (pfp && pfp.startsWith("helmet_")) {
        const color = pfp.split("_")[1].split(".")[0];
        const colorMap = { red: "bg-red-600", blue: "bg-blue-600", yellow: "bg-yellow-500", green: "bg-green-600" };
        return html`<div className="w-8 h-8 rounded-full ${colorMap[color]} flex items-center justify-center text-sm">🏎️</div>`;
      } else if (pfp) {
        return html`<img src="/uploads/${pfp}" className="w-8 h-8 rounded-full object-cover" />`;
      } else {
        return html`<span className="text-xl">👤</span>`;
      }
    })()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">#${user.id}</td>
                  <td className="px-4 py-3 font-bold text-white">${user.username}</td>
                  <td className="px-4 py-3 text-gray-300">${user.email}</td>
                  <td className="px-4 py-3">
                    <span className=${`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-300'}`}>
                      ${user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">${formatDate(user.created_at)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">${formatDate(user.last_login_at)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">${user.last_login_ip || "N/A"}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button 
                      onClick=${() => setEditingUser(user)}
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >Edit</button>
                    <button 
                      onClick=${() => setDeleteConfirm(user)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >Delete</button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Edit User Modal -->
      ${editingUser && html`
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f27] rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit User: ${editingUser.username}</h3>
            <form onSubmit=${handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input 
                  type="text" 
                  value=${editingUser.username}
                  onChange=${e => setEditingUser({ ...editingUser, username: e.target.value })}
                  className="w-full bg-[#262633] border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Points</label>
                  <input 
                    type="number" 
                    value=${editingUser.total_points}
                    onChange=${e => setEditingUser({ ...editingUser, total_points: e.target.value })}
                    className="w-full bg-[#262633] border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Coins</label>
                  <input 
                    type="number" 
                    value=${editingUser.coins}
                    onChange=${e => setEditingUser({ ...editingUser, coins: e.target.value })}
                    className="w-full bg-[#262633] border border-gray-700 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select 
                  value=${editingUser.role}
                  onChange=${e => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full bg-[#262633] border border-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick=${() => setEditingUser(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >Cancel</button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-warmRed hover:bg-red-600 text-white rounded"
                >Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      `}

      <!-- Delete Confirmation Modal -->
      ${deleteConfirm && html`
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1f1f27] rounded-lg border border-gray-700 p-6 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Delete User?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-bold">${deleteConfirm.username}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                onClick=${() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >Cancel</button>
              <button 
                onClick=${() => handleDeleteUser(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >Delete User</button>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}
