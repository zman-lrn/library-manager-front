import React, { useState } from "react";
import { Plus } from "lucide-react";
import StaffCard from "../component/StaffCard";

const initialFakeStaff = [
  {
    id: 1,
    username: "adminUser",
    email: "admin@example.com",
    phone: "(555) 123-4567",
    role: "admin",
    status: "ACTIVE",
    created: "2023-01-15",
  },
  {
    id: 2,
    username: "librarianJane",
    email: "librarian@example.com",
    phone: "(555) 987-6543",
    role: "librarian",
    status: "ACTIVE",
    created: "2023-02-20",
  },
];

export default function StaffPage() {
  const [staffList, setStaffList] = useState(initialFakeStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStaff, setViewStaff] = useState(null);
  const [editStaff, setEditStaff] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    username: "",
    email: "",
    phone: "",
    role: "staff",
    status: "ACTIVE",
  });

  const filteredStaff = staffList.filter((staff) => {
    const term = searchTerm.toLowerCase();
    return (
      staff.username.toLowerCase().includes(term) ||
      staff.email.toLowerCase().includes(term) ||
      staff.role.toLowerCase().includes(term)
    );
  });

  const saveEdit = (e) => {
    e.preventDefault();
    setStaffList((prev) =>
      prev.map((s) => (s.id === editStaff.id ? editStaff : s))
    );
    setEditStaff(null);
  };

  const addStaff = (e) => {
    e.preventDefault();
    const nextId =
      staffList.length > 0 ? Math.max(...staffList.map((s) => s.id)) + 1 : 1;
    const createdDate = new Date().toISOString().split("T")[0];
    const staffToAdd = { ...newStaff, id: nextId, created: createdDate };

    setStaffList((prev) => [...prev, staffToAdd]);
    setShowAddModal(false);
    setNewStaff({
      username: "",
      email: "",
      phone: "",
      role: "staff",
      status: "ACTIVE",
    });
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-900">
            Staff Management
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-gray-950 text-gray-300 px-4 py-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </button>
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="pl-10 w-[95%] h-10 rounded-md border px-3 py-2 text-sm focus-visible:ring-2"
            placeholder="Search staff by username, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onView={() => setViewStaff(staff)}
              onEdit={() => setEditStaff(staff)}
              onDelete={() =>
                setStaffList((prev) => prev.filter((s) => s.id !== staff.id))
              }
            />
          ))}
        </div>

        {viewStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
                onClick={() => setViewStaff(null)}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {viewStaff.username}
              </h2>
              <div className="space-y-3 text-gray-800 text-sm">
                <p>
                  <strong>Email:</strong> {viewStaff.email}
                </p>
                <p>
                  <strong>Phone:</strong> {viewStaff.phone}
                </p>
                <p>
                  <strong>Role:</strong> {viewStaff.role}
                </p>
                <p>
                  <strong>Status:</strong> {viewStaff.status}
                </p>
                <p>
                  <strong>Created:</strong> {viewStaff.created}
                </p>
              </div>
            </div>
          </div>
        )}

        {editStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
                onClick={() => setEditStaff(null)}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Staff
              </h2>
              <form
                onSubmit={saveEdit}
                className="space-y-4 text-gray-700 text-sm"
              >
                <div>
                  <label className="block font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={editStaff.username}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, username: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editStaff.email}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, email: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={editStaff.phone}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, phone: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={editStaff.role}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, role: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    value={editStaff.status}
                    onChange={(e) =>
                      setEditStaff({ ...editStaff, status: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    className="px-4 py-1 rounded border text-gray-600"
                    onClick={() => setEditStaff(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Staff
              </h2>
              <form
                onSubmit={addStaff}
                className="space-y-4 text-gray-700 text-sm"
              >
                <div>
                  <label className="block font-medium mb-1">Username</label>
                  <input
                    type="text"
                    value={newStaff.username}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, username: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={newStaff.phone}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, phone: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Role</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, role: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="librarian">Librarian</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    value={newStaff.status}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, status: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    className="px-4 py-1 rounded border text-gray-600"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Add Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
