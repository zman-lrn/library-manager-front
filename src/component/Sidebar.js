import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  RefreshCw,
  Users,
  UserCog,
  FileText,
  Tags,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Books", icon: BookOpen, path: "/books" },
  { label: "Borrow/Return", icon: RefreshCw, path: "/borrow-return" },
  { label: "Members", icon: Users, path: "/members" },
  { label: "Staff", icon: UserCog, path: "/staff" },
  { label: "Reports", icon: FileText, path: "/reports" },
  { label: "Genres", icon: Tags, path: "/genres" },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      />

      <aside
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-280px)",
          transition: "transform 0.3s ease-in-out",
        }}
        className="fixed top-0 left-0 w-[280px] bg-white shadow-lg z-50 min-h-screen md:static md:translate-x-0 md:shadow-none"
      >
        <h2 className="text-lg font-bold text-center text-gray-900 mt-4">
          Library Manager
        </h2>
        <ul className="mt-4 space-y-2 px-4 list-none">
          {menuItems.map(({ label, icon: Icon, path }) => (
            <li key={label}>
              <Link
                to={path}
                onClick={() => {
                  if (window.innerWidth < 768 && onClose) {
                    onClose();
                  }
                }}
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md transition"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
