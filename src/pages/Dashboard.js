import React, {useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { logoutUser, fetchProfile } from "../store/authSlice";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BarChart3, Bell, ClipboardList, LayoutDashboard, LogOut, MessageCircle, Users, User } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile()).unwrap().catch(() => {
      dispatch(logoutUser());
      navigate("/");
    });
  }, [dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const sections = [
    { name: "Projects", icon: <ClipboardList size={32} />, link: "/projects" },
    { name: "Tasks", icon: <LayoutDashboard size={32} />, link: "/tasks" },
    { name: "Analytics", icon: <BarChart3 size={32} />, link: "/analytics" },
    { name: "Comments", icon: <MessageCircle size={32} />, link: "/tasks/comments" },
    { name: "Notifications", icon: <Bell size={32} />, link: "/notifications" },
    { name: "Profile", icon: <Users size={32} />, link: "/profile" },
  ];

  return (
    <div className="min-h-screen  bg-gray-900 text-white p-6 relative">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {user && (
          <div className="flex items-center mr-4 cursor-pointer" onClick={() => navigate("/profile")}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
            <span className="ml-2 text-white font-semibold">{user.username}</span>
          </div>
        )}
        <Button className="bg-gray-900 hover:bg-red-600 flex items-center" onClick={handleLogout}>
          <LogOut size={20} className="mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <CardContent className="flex flex-col items-center">
                {section.icon}
                <h2 className="text-xl font-semibold mt-4">{section.name}</h2>
                <Link to={section.link}>
                  <Button className="mt-4 bg-blue-500 hover:bg-blue-600">Go to {section.name}</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
