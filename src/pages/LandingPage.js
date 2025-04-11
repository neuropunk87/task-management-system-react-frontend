import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold text-center mb-6"
      >
        Welcome to Task Management System
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-lg text-center max-w-2xl mb-6"
      >
        Organize, track, and collaborate on your tasks effortlessly. Stay productive and manage projects like a pro.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="flex space-x-4"
      >
        <Link
          to="/login"
          className="w-32 text-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="w-32 text-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-lg transition"
        >
          Register
        </Link>
      </motion.div>
    </div>
  );
};

export default LandingPage;
