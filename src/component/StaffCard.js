import React from "react";
import { Shield, User, Eye, SquarePen, Trash2 } from "lucide-react";

export default function StaffCard({ staff, onView, onEdit, onDelete }) {
  const isAdmin = staff.role.toLowerCase() === "admin";

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-lg hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-semibold tracking-tight text-lg flex items-center text-gray-900">
              {isAdmin ? (
                <Shield className="mr-2 h-5 w-5 text-red-500" />
              ) : (
                <User className="mr-2 h-5 w-5 text-blue-500" />
              )}
              {staff.username}
            </div>
            <div className="text-sm text-muted-foreground text-gray-700">
              {staff.email}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                isAdmin
                  ? "bg-destructive text-gray-700"
                  : "bg-primary text-gray-700"
              }`}
            >
              {staff.role.toUpperCase()}
            </div>
            <div
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                staff.status === "ACTIVE"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-red-400 text-gray-300"
              }`}
            >
              {staff.status}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-medium">Phone:</span> {staff.phone}
          </p>
          <p>
            <span className="font-medium">Created:</span> {staff.created}
          </p>
          <p>
            <span className="font-medium">Role:</span> {staff.role}
          </p>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => onView(staff)}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(staff)}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            <SquarePen className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(staff)}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
