import React, { useState, useEffect } from "react";
import API from "../services/api";

function Employees() {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: ""
  });

  // ---------------- FETCH EMPLOYEES ----------------

  const fetchEmployees = async () => {

    setLoading(true);
    setError("");

    try {
      const response = await API.get("/employees");
      setEmployees(response.data);

    } catch (err) {
      setError("Failed to load employees");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ---------------- ADD EMPLOYEE ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.employee_id ||
      !form.full_name ||
      !form.email ||
      !form.department
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await API.post("/employees", form);

      // Reset form
      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: ""
      });

      fetchEmployees();

    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Error adding employee"
      );

    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE EMPLOYEE ----------------

  const deleteEmployee = async (id) => {

    if (!window.confirm("Delete this employee?"))
      return;

    try {
      await API.delete(`/employees/${id}`);
      fetchEmployees();

    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="page-container">

      {/* Heading */}
      <h1>Manage Employees</h1>

      {/* FORM CARD */}
      <form onSubmit={handleSubmit}>

        <div className="form-card">

          <input
            placeholder="Employee ID"
            value={form.employee_id}
            onChange={(e) =>
              setForm({
                ...form,
                employee_id: e.target.value
              })
            }
          />

          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) =>
              setForm({
                ...form,
                full_name: e.target.value
              })
            }
          />

          <input
            placeholder="Email Address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value
              })
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Employee"}
          </button>

        </div>

      </form>

      {/* Loading + Error */}
      {loading && <p>Loading employees...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* TABLE CARD */}
      <div className="table-card">

        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Dept</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {employees.length === 0 && !loading ? (
              <tr>
                <td colSpan="5">
                  No Employees Found
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.employee_id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button
                      className="delete-btn"
                      disabled={loading}
                      onClick={() =>
                        deleteEmployee(emp.employee_id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Employees;
