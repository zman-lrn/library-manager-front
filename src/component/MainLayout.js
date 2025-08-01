import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import { Menu } from "lucide-react";

export default function MainLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen">
      {isLoggedIn && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}

      <div className="flex-1 bg-gray-50">
        {isLoggedIn && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 text-gray-700 bg-white p-2 rounded-md shadow-md hover:bg-gray-100 md:hidden"
          >
            <Menu className="w-3 h-3" />
          </button>
        )}
        <ToastContainer position="bottom-right" autoClose={3000} />
        <main className="p-6 mt-2">
          {isLoggedIn && <Header />}
          {children}
        </main>
      </div>
    </div>
  );
}
