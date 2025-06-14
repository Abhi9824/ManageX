import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEngineers,
  createEngineer,
  deleteEngineer,
} from "../../features/engineerSlice";

const EngineerManagement = () => {
  const dispatch = useDispatch();
  const { engineers, loading, error } = useSelector((state) => state.engineers);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
  });

  useEffect(() => {
    dispatch(fetchEngineers());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createEngineer(formData));
    setFormData({ name: "", email: "", specialization: "" });
  };

  const handleDelete = (id) => {
    dispatch(deleteEngineer(id));
  };

  return (
    <div className="container mt-4">
      <h3>Engineer Management</h3>

      <form onSubmit={handleSubmit} className="row g-2 my-3">
        <input
          className="form-control"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="form-control"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="form-control"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) =>
            setFormData({ ...formData, specialization: e.target.value })
          }
        />
        <button className="btn btn-primary mt-2" type="submit">
          Add Engineer
        </button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {engineers.map((eng) => (
              <tr key={eng._id}>
                <td>{eng.name}</td>
                <td>{eng.email}</td>
                <td>{eng.specialization}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(eng._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EngineerManagement;
