// components/DashboardPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./DashboardPage.css";

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handlePopState = (event) => {
  //     navigate("/dashboard", { replace: true }); // Redirect to dashboard on back button click
  //   };

  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard!</p>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
