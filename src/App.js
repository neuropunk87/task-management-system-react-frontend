import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthForm type="login" />} />
        <Route path="/register" element={<AuthForm type="register" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
};

export default App;
