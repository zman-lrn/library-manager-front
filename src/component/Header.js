import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { LogOut, User } from "lucide-react";
export default function Header() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-10  w-full md:w-[calc(100%-280px)]">
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          <span className="text-sm text-gray-600">Welcome, admin</span>

          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-8 rounded-full"
            type="button"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                A
              </span>
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-32 w-32 rounded-md border bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                type="button"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <button
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                type="button"
              >
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
