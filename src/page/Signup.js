import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { Form, useNavigate, Link } from "react-router-dom";
import { SignupAPI } from "../axios/axios";

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting form:", form);
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await SignupAPI(form);
      console.log("Signup response:", response.data);

      alert("Signup successful!");

      setForm({
        username: "",
        email: "",
        password: "",
        role: "admin",
      });

      navigate("/login");
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  console.log(Form);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="text-blue-600 text-center mb-4">
          <BookOpen size={38} strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-700">
          Library Manager System
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Create an account to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-bold text-gray-800"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-800">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="text-sm font-bold text-gray-800">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-gray-700"
              required
            >
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`items-center justify-center gap-2 bg-gray-800 text-white text-sm font-medium h-10 px-4 py-2 w-full rounded-lg transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <svg
                className="w-5 h-5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          If you have an account already,{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            log in here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
