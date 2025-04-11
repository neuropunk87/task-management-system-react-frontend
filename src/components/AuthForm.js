import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", password2: "" });
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || (type === "register" && (!formData.email || !formData.password2))) {
      setFormError("All fields are required");
      return;
    }
    if (type === "register" && formData.password !== formData.password2) {
      setFormError("Passwords do not match");
      return;
    }

    if (type === "login") {
      dispatch(loginUser({ username: formData.username, password: formData.password })).then((result) => {
        if (result.meta.requestStatus === "fulfilled") navigate("/dashboard");
      });
    } else {
      dispatch(registerUser(formData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") navigate("/login");
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 relative">
        <button onClick={() => navigate("/")} className="absolute top-4 left-4 p-2 bg-gray-600 hover:bg-gray-700 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">{type === "login" ? "Login" : "Register"}</h2>
        {formError && <p className="text-red-500 text-center">{formError}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} className="w-full p-3 mb-3 rounded bg-gray-700 text-white focus:ring" />
          {type === "register" && <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 mb-3 rounded bg-gray-700 text-white focus:ring" />}
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 mb-3 rounded bg-gray-700 text-white focus:ring" />
          {type === "register" && <input type="password" name="password2" placeholder="Confirm Password" value={formData.password2} onChange={handleChange} className="w-full p-3 mb-3 rounded bg-gray-700 text-white focus:ring" />}
          <button className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded" disabled={loading}>{loading ? "Processing..." : type === "login" ? "Login" : "Register"}</button>
        </form>
      </div>
    </motion.div>
  );
};
export default AuthForm;
