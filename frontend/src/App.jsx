// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // <-- import CSS

import LandingPage from "./pages/landingPage/LandingPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Inventory from "./pages/dashboard/Inventory";
import Purchases from "./pages/dashboard/purchases/Purchases";
import Billing from "./pages/dashboard/Billing";
import AuthContainer from "./pages/loginAndSignup/AuthContainer";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/signup" element={<AuthContainer />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>

      {/* Add this line for toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
