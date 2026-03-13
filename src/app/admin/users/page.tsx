"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
  must_change_password: boolean;
  last_login: string | null;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: "", display_name: "", password: "", role: "editor" });

  const fetchUsers = () => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("User created");
      setShowForm(false);
      setForm({ email: "", display_name: "", password: "", role: "editor" });
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to create user");
    }
  };

  const handleForcePasswordChange = async (userId: string) => {
    await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ must_change_password: true }),
    });
    toast.success("User must change password on next login");
    fetchUsers();
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt("Enter new temporary password (min 8 chars):");
    if (!newPassword || newPassword.length < 8) {
      if (newPassword) toast.error("Password must be at least 8 characters");
      return;
    }
    await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    toast.success("Password reset. User must change on next login.");
    fetchUsers();
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete user ${user.display_name}?`)) return;
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("User deleted");
      fetchUsers();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to delete");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-charcoal">
          Users
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal hover:bg-teal-dark text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Display Name</label>
            <input
              type="text"
              required
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Temporary Password
            </label>
            <input
              type="text"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"
            >
              Create User
            </button>
            <p className="text-xs text-gray-400 mt-1">
              User will be required to change their password on first login.
            </p>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="font-medium text-charcoal">{user.display_name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user.role === "owner"
                      ? "bg-purple-100 text-purple-700"
                      : user.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.role}
                </span>
                {user.must_change_password && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    Must change pwd
                  </span>
                )}
                {user.role !== "owner" && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="text-gray-400 hover:text-teal text-xs transition-colors"
                      title="Reset password"
                    >
                      Reset Pwd
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                      onClick={() => handleForcePasswordChange(user.id)}
                      className="text-gray-400 hover:text-orange-500 text-xs transition-colors"
                      title="Force password change"
                    >
                      Force Change
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-gray-400 hover:text-red-500 text-xs transition-colors"
                      title="Delete user"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
