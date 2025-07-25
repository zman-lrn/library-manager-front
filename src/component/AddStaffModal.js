import React, { useState } from "react";

export default function AddStaffModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
    confirmPassword: "",
  });

  const [err, setErr] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErr("");
  };

  const handleAdd = () => {
    const { username, email, phone, role, password, confirmPassword } =
      formData;

    if (
      !username.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !role.trim() ||
      !password ||
      !confirmPassword
    ) {
      setErr("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    onAdd({ username, email, phone, role, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-950">
            Add Staff Member
          </h2>
          <button
            className="text-gray-600 hover:text-red-500"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Enter the details for the new staff member.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              className="w-full border rounded px-1 py-2 mt-1"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full border rounded px-1 py-2 mt-1"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="text"
              className="w-full border rounded px-1 py-2 mt-1"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              className="w-full border rounded px-1 py-2 mt-1"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full border rounded px-1 py-2 mt-1"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              className="w-full border rounded px-1 py-2 mt-1"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        {err && (
          <p className="text-red-600 text-sm mt-4 text-center" role="alert">
            {err}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gray-950 text-white rounded"
            onClick={handleAdd}
          >
            Create Staff
          </button>
        </div>
      </div>
    </div>
  );
}
