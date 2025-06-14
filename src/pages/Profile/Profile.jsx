import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  logoutUser,
  updateUserProfile,
} from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    skills: [],
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleEditClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((skill) => skill.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      handleCloseModal();
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading)
    return <div className="text-center mt-10 text-xl">Loading...</div>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        Error fetching profile: {error}
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10 text-yellow-600">
        No user data found. Try logging in again.
      </div>
    );

  return (
    <div className="flex flex-col items-center px-4 mt-10">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile</h2>

        <div className="space-y-2 text-gray-800">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.role === "engineer" && user.skills?.length > 0 && (
            <p>
              <strong>Skills:</strong>{" "}
              {user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-2 mb-1"
                >
                  {skill}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleEditClick}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              {formData.role === "engineer" && (
                <div>
                  <label className="block font-medium mb-1">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills.join(", ")}
                    onChange={handleSkillsChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 mx-2 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
