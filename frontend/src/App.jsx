// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/landingPage/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Inventory from "./pages/dashboard/Inventory";
import Purchases from "./pages/dashboard/purchases/Purchases";
import Billing from "./pages/dashboard/Billing";
import AuthContainer from "./pages/loginAndSignup/AuthContainer";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/signup" element={<AuthContainer />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </UserProvider>
  );
}
