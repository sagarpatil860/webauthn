// routes/Routes.js
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../components/LoginPage";
import DashboardPage from "../components/DashboardPage";
import About from "../components/About";
import Layout from "../components/Layout";
import HomePage from "../components/HomePage";
import ToDo from "../components/ToDo/ToDo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <PrivateRoute element={HomePage} /> },
      { path: "/about", element: <PrivateRoute element={About} /> },
      { path: "/dashboard", element: <PrivateRoute element={DashboardPage} /> },
      { path: "/todo", element: <PrivateRoute element={ToDo} /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;
