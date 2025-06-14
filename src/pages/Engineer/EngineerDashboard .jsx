import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const EngineerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
 
  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 font-[Instrument]">
        Welcome, {user?.name || "Engineer"}!
      </h1>

      <h3 className="text-l font-semibold mb-4 text-gray-700">
        Allocated Assignments
      </h3>
      {user?.assignments && user.assignments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {user?.assignments?.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {assignment.name}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Name:</span>{" "}
                {assignment?.name || "N/A"}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Role:</span> {assignment.role}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Allocation:</span>{" "}
                {assignment.allocationPercentage}%
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Start:</span>{" "}
                {new Date(assignment.startDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">End:</span>{" "}
                {new Date(assignment.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`capitalize font-semibold ${
                    assignment.status === "completed"
                      ? "text-green-600"
                      : assignment.status === "active"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                >
                  {assignment.status || "upcoming"}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 italic mt-8">No assignments found.</div>
      )}
    </div>
  );
};

export default EngineerDashboard;
