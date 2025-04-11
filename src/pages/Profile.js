import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile, changePassword, uploadAvatar, logoutUser } from "../store/authSlice";
import { Card, CardContent } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const fileInputRef = useRef(null);
  const [avatarError, setAvatarError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchProfile()).unwrap().catch(() => {
      dispatch(logoutUser());
      navigate("/");
    });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        telegram_id: user.telegram_id || "",
        telegram_notifications_enabled: user.telegram_notifications_enabled ?? false,
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      await dispatch(changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password
      })).unwrap();
      alert("Password changed successfully!");
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      setPasswordError(error);
    }
  };

  const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAvatarError("Avatar size must be under 2MB");
        return;
      }
      setAvatarError(null);
      await dispatch(uploadAvatar(file));
      dispatch(fetchProfile());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { avatar, ...profileData } = formData;

    try {
      await dispatch(updateProfile(profileData)).unwrap();
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
        console.error("Profile update error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center"
    >
      <Card className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg relative">
        <CardContent>
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-4 left-4 p-2 bg-gray-600 hover:bg-gray-700 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-3xl font-bold text-center mb-4">Profile</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex flex-col items-center p-6">
            <div
              className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={handleAvatarClick}
            >
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                  Avatar max 2MB
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {avatarError && <p className="text-red-500 mt-2">{avatarError}</p>}
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="text-center">

              {/* Username (Read-Only) */}
              <div className="mb-3">
                <label className="block text-left">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled
                />
              </div>

              {/* Email (Read-Only) */}
              <div className="mb-3">
                <label className="block text-left">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled
                />
              </div>

              {/* Role (Read-Only) */}
              <div className="mb-3">
                <label className="block text-left">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled
                />
              </div>

              {/* First Name */}
              <div className="mb-3">
                <label className="block text-left">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled={!editMode}
                />
              </div>

              {/* Last Name */}
              <div className="mb-3">
                <label className="block text-left">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled={!editMode}
                />
              </div>

              {/* Telegram ID */}
              <div className="mb-3">
                <label className="block text-left">Telegram ID</label>
                <input
                  type="text"
                  name="telegram_id"
                  value={formData.telegram_id}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled={!editMode}
                />
              </div>

              {/* Telegram Notifications Enabled */}
              <div className="mb-3 flex items-center">
                <label className="block text-left mr-2">Telegram Notifications</label>
                <input
                  type="checkbox"
                  name="telegram_notifications_enabled"
                  checked={formData.telegram_notifications_enabled}
                  onChange={handleChange}
                  disabled={!editMode || !formData.telegram_id}
                />
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label className="block text-left">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled={!editMode}
                />
              </div>

              {/* Date of Birth */}
              <div className="mb-3">
                <label className="block text-left">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  disabled={!editMode}
                />
              </div>

              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className={`w-full ${editMode ? 'hidden' : 'block'} bg-green-500 hover:bg-green-600 p-3 rounded mt-4`}
              >
                Edit Profile
              </button>

              {editMode && (
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded mt-4"
                >
                  Save Changes
                </button>
              )}
            </form>
          )}
          {editMode && (
            <form onSubmit={handleChangePassword} className="text-center mt-6">
              <h2 className="text-xl font-bold mb-2">Change Password</h2>
              {passwordError && <p className="text-red-500">{passwordError}</p>}

              <div className="mb-3">
                <label className="block text-left">Current Password</label>
                <input
                  type="password"
                  name="old_password"
                  value={passwords.old_password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-left">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-left">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded mt-4"
              >
                Change Password
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Profile;
