import React, { useState, useEffect } from "react";
import {
  allmembers,
  editMembers,
  addMembers,
  deleteMembers,
} from "../axios/axios";
import { Plus, Eye, History, SquarePen, Trash2, Search } from "lucide-react";

export default function MembersPage() {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [err, setErr] = useState("");
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    // join_date: "",
  });

  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    const fetchmembers = async () => {
      const data = await allmembers(token);
      if (data) setMembers(data.data);
    };

    fetchmembers();
  }, []);
  const filteredMembers = members.filter((member) =>
    `${member.name} ${member.email} ${member.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const addMember = async () => {
    const token = localStorage.getItem("token");
    try {
      if (
        !newMember.name.trim() ||
        !newMember.email.trim() ||
        !newMember.phone.trim()
      ) {
        setErr("Please fill in all required fields.");
        return;
      }

      const response = await addMembers(newMember, token);

      console.log("Response:", response.message);

      if (response && response.status === 201) {
        setMembers((prevMembers) => [...prevMembers, response.data]);
        setShowAddMemberModal(false);
        setNewMember({
          name: "",
          email: "",
          phone: "",
        });
        setErr("");
      }
      setErr(response.message[0] || "Failed to add member");
    } catch (error) {
      console.log("An error occurred while submitting the member.");
    }
  };
  const editMember = async () => {
    // Trim inputs before validation
    if (
      !newMember.name.trim() ||
      !newMember.email.trim() ||
      !newMember.phone.trim()
    ) {
      setErr("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const { join_date, id, ...memberWithoutJoinDate } = newMember;

      const response = await editMembers(
        newMember.id,
        memberWithoutJoinDate,
        token
      );

      if (response && response.status === 200) {
        setMembers((prev) =>
          prev.map((m) => (m.id === newMember.id ? { ...newMember } : m))
        );
        setShowEditModal(false);
        setSelectedMember(null);
        setErr("");
      } else {
        setErr(response.message || "Failed to update member.");
      }
    } catch (error) {
      setErr("An error occurred while updating the member.");
    }
  };
  const deleteMember = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await deleteMembers(selectedMember.id, token);

      if (response && response.status === 200) {
        setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
        setShowDeleteModal(false);
        setSelectedMember(null);
        setErr("");
      } else {
        setErr(response.message || "Failed to delete member.");
      }
    } catch (error) {
      setErr("An error occurred while deleting the member.");
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Members</h1>
            <p className="text-gray-600">Manage library members</p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-gray-950 text-gray-300 px-4 py-2"
            onClick={() => setShowAddMemberModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-5  transform text-gray-400 h-5 w-5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
            placeholder="Search members by name, email, or phone..."
          />
        </div>
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => {
              setSelectedMember(member);
              setShowViewModal(true);
            }}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="rounded-lg border bg-card text-card-foreground shadow-lg hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold tracking-tight text-lg text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-sm text-muted-foreground text-gray-600">
                      {member.email}
                    </div>
                  </div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-gray-200 bg-gray-900">
                    {member.activeBorrows} active
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Phone:</span> {member.phone}
                  </p>
                  <p>
                    <span className="font-medium">Joined:</span>{" "}
                    {member.join_date}
                  </p>
                  <p>
                    <span className="font-medium">Active Borrows:</span>{" "}
                    {member.activeBorrows}
                  </p>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowViewModal(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                    <History className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    onClick={() => {
                      setSelectedMember(member);
                      setNewMember(member);
                      setShowEditModal(true);
                    }}
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    onClick={() => {
                      setSelectedMember(member);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">
                Add Member
              </h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowAddMemberModal(false)}
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Enter the details for the new member.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Joined Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={newMember.join_date}
                  onChange={(e) =>
                    setNewMember({ ...newMember, join_date: e.target.value })
                  }
                />
              </div>
            </div>
            {err && (
              <p className="text-red-600 text-sm mt-2 text-center">{err}</p>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowAddMemberModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-950 text-white rounded"
                onClick={addMember}
              >
                Create Member
              </button>
            </div>
          </div>
        </div>
      )}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">
                Member Details
              </h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowViewModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <span className="font-medium">Name:</span> {selectedMember.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedMember.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {selectedMember.phone}
              </p>
              <p>
                <span className="font-medium">Joined:</span>{" "}
                {selectedMember.join_date}
              </p>
              <p>
                <span className="font-medium">Active Borrows:</span>{" "}
                {selectedMember.activeBorrows}
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-950 text-white rounded"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-950">
                Edit Member
              </h2>
              <button
                className="text-gray-600 hover:text-red-500"
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="Name"
              />
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
                placeholder="Email"
              />
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
                placeholder="Phone"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gray-950 text-white rounded"
                onClick={editMember}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <strong>{selectedMember.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={deleteMember}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
