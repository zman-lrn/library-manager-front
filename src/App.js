import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./component/MainLayout";
import AdminDashboard from "./page/AdminDashboard";
import Login from "./page/Login";
import Books from "./page/BookPage";
import BorrowReturnPage from "./page/BorrowReturnPage";
import MembersPage from "./page/MembersPage";
import StaffPage from "./page/StaffPage";
import Report from "./page/Report";
import Genres from "./page/Genres";
import Profile from "./page/Profile";
import Signup from "./page/Signup";
import PrivateRoute from "./component/PrivateRoute";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Books />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/borrow-return"
            element={
              <PrivateRoute>
                <BorrowReturnPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/members"
            element={
              <PrivateRoute>
                <MembersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <PrivateRoute>
                <StaffPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />
          <Route
            path="/genres"
            element={
              <PrivateRoute>
                <Genres />
              </PrivateRoute>
            }
          />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
