import React, { useState } from "react";
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

  const filteredStaff = staffList.filter((staff) => {
    const term = searchTerm.toLowerCase();
    return (
      staff.username.toLowerCase().includes(term) ||
      staff.email.toLowerCase().includes(term) ||
      staff.role.toLowerCase().includes(term)
    );
  });

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-6">
        <div className="text-3xl font-bold text-gray-900">Staff Management</div>

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
              onView={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
