import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchEngineers } from "../../features/engineerSlice";
import { fetchProjects } from "../../features/projectSlice";
import { createProject } from "../../features/projectSlice";
import {
  createAssignment,
  fetchAssignments,
} from "../../features/assignmentSlice";
import { fetchCapacities } from "../../features/capacitySlice";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { engineers, loading, error } = useSelector((state) => state.engineers);
  const { assignments } = useSelector((state) => state.assignments);
  const { projects } = useSelector((state) => state.projects);
  const { data: capacities } = useSelector((state) => state.capacity);
  const { user } = useSelector((state) => state.auth);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    requiredSkills: "",
    teamSize: "",
    status: "planning",
  });

  const [assignmentForm, setAssignmentForm] = useState({
    name: "",
    engineerId: "",
    projectId: "",
    allocationPercentage: 0,
    startDate: "",
    endDate: "",
    role: "Developer",
    createdBy: user?._id,
  });

  useEffect(() => {
    dispatch(fetchEngineers());
    dispatch(fetchProjects());
    dispatch(fetchCapacities());
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const formatted = {
      ...projectForm,
      requiredSkills: projectForm.requiredSkills
        .split(",")
        .map((s) => s.trim()),
    };

    try {
      const action = await dispatch(createProject(formatted));
      if (createProject.fulfilled.match(action)) {
        toast.success("Project created successfully!");
        setShowProjectModal(false);
        setProjectForm({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          requiredSkills: "",
          teamSize: "",
          status: "planning",
        });
        // Fetch projects again after successful creation
        dispatch(fetchProjects());
      } else {
        toast.error("Failed to create project!");
      }
    } catch (err) {
      toast.error("An error occurred while creating the project!");
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const action = await dispatch(createAssignment(assignmentForm));
      if (createAssignment.fulfilled.match(action)) {
        toast.success("Assignment created successfully!");
        setShowAssignmentModal(false);
        setAssignmentForm({
          name: "",
          engineerId: "",
          projectId: "",
          allocationPercentage: 0,
          startDate: "",
          endDate: "",
          role: "Developer",
          createdBy: user?._id,
        });
        dispatch(fetchAssignments());
      } else {
        toast.error("Failed to create assignment!");
      }
    } catch (err) {
      toast.error("An error occurred while creating the assignment!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 py-0 font-[Instrument]">
        Manager Dashboard
      </h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
          onClick={() => setShowProjectModal(true)}
        >
          Create Project
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
          onClick={() => setShowAssignmentModal(true)}
        >
          Create Assignment
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading engineers...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <>
          <div className="mt-6">
            <h1 className="text-xl font-bold mt-12 mb-6 text-gray-800 py-0 font-[Instrument]">
              Available Engineers
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {engineers.map((eng) => {
                const cap = capacities.find((c) => c.engineerId === eng._id);
                return (
                  <div
                    key={eng._id}
                    className="bg-white rounded-lg shadow-md p-5"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {eng.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{eng.email}</p>
                    <p className="text-gray-600 text-md mt-1">
                      Seniority-level: {eng.seniority || "N/A"}
                    </p>
                    <p className="text-gray-600 text-md mt-1">
                      Max Capacity: {eng.maxCapacity}
                    </p>
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Available Capacity
                      </label>
                      <div className="relative group">
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-4 rounded-full transition-all duration-500 ${
                              eng.availableCapacity > 60
                                ? "bg-green-500"
                                : eng.availableCapacity > 30
                                ? "bg-yellow-400"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  Number(eng.availableCapacity || 0)
                                )
                              )}%`,
                            }}
                          ></div>
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-10 whitespace-nowrap">
                          {eng.availableCapacity !== undefined
                            ? `${eng.availableCapacity}% available`
                            : "No capacity data"}
                        </div>
                        {/* Value inside bar */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-gray-800 pointer-events-none select-none">
                          {eng.availableCapacity !== undefined
                            ? `${eng.availableCapacity}%`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-indigo-500 font-medium capitalize">
                      Role: {eng.role}
                    </p>

                    {cap && (
                      <div className="mt-3 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">
                            Current Allocation:
                          </span>{" "}
                          {cap.currentAllocation}%
                        </p>
                        <p>
                          <span className="font-semibold">
                            Available Capacity:
                          </span>{" "}
                          {cap.availableCapacity}%
                        </p>
                        <p>
                          <span className="font-semibold">Max Capacity:</span>{" "}
                          {cap.maxCapacity}%
                        </p>
                      </div>
                    )}

                    {eng.skills?.length ? (
                      <div className="mt-3">
                        <h4 className="text-sm font-semibold text-gray-700">
                          Skills:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {eng.skills.map((skill, idx) => (
                            <li key={idx}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-400 italic">
                        No skills listed
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-12">
            <h1 className="text-xl font-bold mt-12 mb-6 text-gray-800 py-0 font-[Instrument]">
              Projects By You
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-md font-bold text-gray-800">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {project.description}
                  </p>

                  <div className="mt-3">
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Start:</span>{" "}
                      {new Date(project.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">End:</span>{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Team Size:</span>{" "}
                      {project.teamSize}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`capitalize font-semibold ${
                          project.status === "completed"
                            ? "text-green-600"
                            : project.status === "active"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {project.status}
                      </span>
                    </p>
                  </div>

                  {project.requiredSkills?.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-semibold text-gray-700">
                        Skills Required:
                      </h5>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {project.requiredSkills.map((skill, idx) => (
                          <li key={idx}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12">
            <h1 className="text-xl font-bold mt-12 mb-6 text-gray-800 py-0 font-[Instrument]">
              Assignments Assigned by You
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-800">
                    {assignment.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-semibold">Engineer:</span>{" "}
                    {assignment.engineerId?.name || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-semibold">Project:</span>{" "}
                    {assignment.projectId?.name || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-semibold">Role:</span>{" "}
                    {assignment.role}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-semibold">Allocation:</span>{" "}
                    {assignment.allocationPercentage}%
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-semibold">Start Date:</span>{" "}
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-semibold">End Date:</span>{" "}
                    {new Date(assignment.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Project Modal */}
      {/* {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-white w-full max-w-full sm:max-w-2xl rounded-2xl shadow-lg p-4 sm:p-8 relative mx-2 sm:mx-0 flex flex-col max-h-[100dvh] sm:max-h-[95vh]">
              <div className="overflow-y-auto flex-1">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                  Create Project
                </h2>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="Project Name"
                      className="input w-full"
                      required
                      value={projectForm.name}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Description"
                      className="input w-full"
                      rows="3"
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="input w-full"
                        value={projectForm.startDate}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="input w-full"
                        value={projectForm.endDate}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            endDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Required Skills{" "}
                      <span className="text-xs text-gray-400">
                        (comma separated)
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, AWS"
                      className="input w-full"
                      value={projectForm.requiredSkills}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          requiredSkills: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Team Size
                    </label>
                    <input
                      type="number"
                      placeholder="Team Size"
                      className="input w-full"
                      value={projectForm.teamSize}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          teamSize: e.target.value,
                        })
                      }
                      min={1}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Status
                    </label>
                    <select
                      className="input w-full"
                      value={projectForm.status}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          status: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Project Modal */}
      {showProjectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-2 py-4 sm:px-4 sm:py-6 overflow-y-auto"
          style={{
            backdropFilter: "blur(6px)",
            background: "rgba(255,255,255,0.3)",
          }}
        >
          <div
            className="bg-white w-full max-w-full sm:max-w-2xl rounded-2xl shadow-lg relative mx-2 sm:mx-0 overflow-hidden"
            style={{
              maxHeight: "90vh",
            }}
          >
            <div className="overflow-y-auto max-h-[85vh] p-3 sm:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                Create Project
              </h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Project Name"
                    className="input w-full"
                    required
                    value={projectForm.name}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Description"
                    className="input w-full"
                    rows="3"
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="input w-full"
                      value={projectForm.startDate}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          startDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="input w-full"
                      value={projectForm.endDate}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          endDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Required Skills{" "}
                    <span className="text-xs text-gray-400">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, AWS"
                    className="input w-full"
                    value={projectForm.requiredSkills}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        requiredSkills: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Team Size
                  </label>
                  <input
                    type="number"
                    placeholder="Team Size"
                    className="input w-full"
                    value={projectForm.teamSize}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        teamSize: e.target.value,
                      })
                    }
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Status
                  </label>
                  <select
                    className="input w-full"
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        status: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-2 py-4 sm:px-4 sm:py-6 overflow-y-auto"
          style={{
            backdropFilter: "blur(6px)",
            background: "rgba(255,255,255,0.3)",
          }}
        >
          <div
            className="bg-white w-full max-w-full sm:max-w-2xl rounded-2xl shadow-lg relative mx-2 sm:mx-0 overflow-hidden"
            style={{
              maxHeight: "90vh",
            }}
          >
            <div className="overflow-y-auto max-h-[85vh] p-3 sm:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
                Create Assignment
              </h2>

              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Assignment Name
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Assignment Name"
                    value={assignmentForm.name || ""}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Engineer
                  </label>
                  <select
                    className="input w-full"
                    value={assignmentForm.engineerId}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        engineerId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Engineer</option>
                    {engineers.map((eng) => (
                      <option key={eng._id} value={eng._id}>
                        {eng.name}
                        {eng.skills && eng.skills.length > 0
                          ? ` | ${eng.skills.join(", ")}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Project
                  </label>
                  <select
                    className="input w-full"
                    value={assignmentForm.projectId}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        projectId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Available Project</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name} — {proj.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Allocation %
                  </label>
                  <input
                    type="number"
                    placeholder="Allocation %"
                    className="input w-full"
                    value={assignmentForm.allocationPercentage}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        allocationPercentage: Number(e.target.value),
                      })
                    }
                    min={0}
                    max={100}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="input w-full"
                      value={assignmentForm.startDate}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          startDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 font-medium mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="input w-full"
                      value={assignmentForm.endDate}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          endDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Assignment Role
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      "Developer",
                      "Tech Lead",
                      "QE",
                      "Tester",
                      "Cloud Engineer",
                      "Frontend Developer",
                      "Backend Developer",
                    ].map((role) => (
                      <label key={role} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="assignmentRole"
                          value={role}
                          checked={assignmentForm.role === role}
                          onChange={(e) =>
                            setAssignmentForm({
                              ...assignmentForm,
                              role: e.target.value,
                            })
                          }
                          required
                        />
                        <span>{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAssignmentModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManagerDashboard;
