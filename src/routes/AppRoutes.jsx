// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/DashBoard";
import NotFound from "../pages/Notfound";
import ProtectedRoute from "../components/ProtectedRoute";
import Projects from "../pages/Projects";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import Signup from "../pages/SignUp";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* All protected routes here */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
