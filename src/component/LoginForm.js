import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../axios/axios";
import { BookOpen } from "lucide-react";
import { AuthContext } from "./AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(form);
      console.log("login", response);

      const { access_token } = response.data;
      const userStr =
        '{"id":2,"username":"test","email":"test@test.com","role":"admin"}';
      const userObj = JSON.parse(userStr);

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", userObj.id);
      login(access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Failed:", err.response?.data || err.message);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="text-blue-600 text-center">
          <BookOpen size={38} strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-700">
          Library Manager System
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to your account to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="text-sm font-bold text-gray-800 "
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Username"
              value={form.email}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px- py-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold mb-2 text-gray-800 "
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px- py-2"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={` items-center justify-center gap-2 bg-gray-800 text-white text-sm font-medium h-10 px-4 py-2 w-full rounded-lg transition ${
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
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          If you Don't have an account,{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            sign up here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
