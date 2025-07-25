import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Shield, Calendar, Plus } from "lucide-react";
import StaffCard from "../component/StaffCard";
import EditStaffModal from "../component/ViewStaffModal";
import AddStaffModal from "../component/AddStaffModal";
import {
  getStaff,
  allmembers,
  deleteStaff,
  updateStaff,
  SignupAPI,
} from "../axios/axios";

export default function StaffPage() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [mergedStaff, setMergedStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  const handleView = (staff) => {
    setSelectedStaff(staff);
    setShowViewModal(true);
  };
  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (id, updatedData) => {
    const token = localStorage.getItem("token");

    const { phone, ...submitData } = updatedData;

    try {
      const res = await updateStaff(id, submitData, token);
      console.log("Update response:", res);

      setMergedStaff((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update staff", error);
    }
  };
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const staffRes = await getStaff(token);
      const memberRes = await allmembers(token);

      const users = staffRes.data.users || [];
      const members = memberRes.data || [];

      const merged = users.map((user) => {
        const memberInfo = members.find((m) => m.id === user.id);
        return {
          id: user.id,
          username: user.username,
          role: user.role,
          email: memberInfo?.email || "N/A",
          phone: memberInfo?.phone || "N/A",
          created: memberInfo?.join_date || "N/A",
          name: memberInfo?.name || user.username,
          status: "ACTIVE",
        };
      });

      setMergedStaff(merged);
    } catch (error) {
      console.error("Error merging staff and members", error);
    }
  };
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      console.log(id);

      try {
        await deleteStaff(id.id, token);
        fetchData();
        setMergedStaff((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Failed to delete staff", error);
      }
    }
  };

  const handleAddStaff = async (staffData) => {
    const token = localStorage.getItem("token");
    try {
      const { phone, ...restData } = staffData;
      console.log("Adding staff", staffData);

      const response = await SignupAPI(restData);
      const newStaff = {
        id: Date.now(),
        username: staffData.username,
        email: staffData.email,
        phone: staffData.phone,
        role: staffData.role,
        created: new Date().toISOString().slice(0, 10),
        status: "ACTIVE",
      };

      setMergedStaff((prev) => [newStaff, ...prev]);
      setShowAddStaffModal(false);
    } catch (error) {
      console.error("Failed to add staff", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-gray-900">
            Staff Management
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-gray-950 text-gray-300 px-4 py-2"
            onClick={() => setShowAddStaffModal(true)}
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
          {mergedStaff
            .filter((staff) => {
              const term = searchTerm.toLowerCase();
              return (
                staff.username.toLowerCase().includes(term) ||
                staff.email.toLowerCase().includes(term) ||
                staff.role.toLowerCase().includes(term)
              );
            })
            .map((staff) => (
              <StaffCard
                key={staff.id}
                staff={staff}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}

          {showAddStaffModal && (
            <AddStaffModal
              onClose={() => setShowAddStaffModal(false)}
              onAdd={handleAddStaff}
            />
          )}

          {showEditModal && selectedStaff && (
            <EditStaffModal
              staff={selectedStaff}
              onClose={() => setShowEditModal(false)}
              onSubmit={(updatedData) =>
                handleSaveEdit(selectedStaff.id, updatedData)
              }
            />
          )}

          {showViewModal && selectedStaff && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {/* Header */}
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
                  onClick={() => setShowViewModal(false)}
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {selectedStaff.username}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Staff Member Details
                </p>

                {/* Info */}
                <div className="space-y-3 text-gray-800 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Username:</span>
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{selectedStaff.username}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Email:</span>
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{selectedStaff.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Phone:</span>
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedStaff.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Role:</span>
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span>
                      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                        {selectedStaff.role?.toUpperCase()}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Created:</span>
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{selectedStaff.created}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Status:</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        selectedStaff.status === "ACTIVE"
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {selectedStaff.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
