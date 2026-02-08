import React, { useState, useEffect } from "react";
import API from "../services/api";

function Attendance() {

  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present"
  });

  // -------- FETCH EMPLOYEES --------

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Employee fetch error", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // -------- FETCH ATTENDANCE --------

  const fetchAttendance = async (id) => {

    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.get(`/attendance/${id}`);
      setRecords(res.data);

    } catch (err) {
      setError("Failed to load attendance");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form.employee_id) {
      fetchAttendance(form.employee_id);
    }
  }, [form.employee_id]);

  // -------- MARK ATTENDANCE --------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.employee_id || !form.date) {
      alert("Please select employee and date");
      return;
    }

    setLoading(true);

    try {
      await API.post("/attendance", form);

      // Refresh records
      fetchAttendance(form.employee_id);

      // Reset date only
      setForm({
        ...form,
        date: ""
      });

    } catch (err) {
      console.error("Attendance error", err);

    } finally {
      setLoading(false);
    }
  };

  // -------- UI --------

  return (
    <div className="page-container">

      {/* Heading */}
      <h1>Mark Attendance</h1>

      {/* FORM CARD */}
      <form onSubmit={handleSubmit}>

        <div className="form-card">

          {/* Employee Dropdown */}
          <select
            value={form.employee_id}
            onChange={(e) =>
              setForm({
                ...form,
                employee_id: e.target.value
              })
            }
          >
            <option value="">
              Select Employee
            </option>

            {employees.map(emp => (
              <option
                key={emp.employee_id}
                value={emp.employee_id}
              >
                {emp.full_name}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value
              })
            }
          />

          {/* Status */}
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value
              })
            }
          >
            <option>Present</option>
            <option>Absent</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Marking..." : "Mark Attendance"}
          </button>

        </div>

      </form>

      {/* Loading + Error */}
      {loading && <p>Loading attendance...</p>}

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
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {records.length === 0 && !loading ? (
              <tr>
                <td colSpan="2">
                  No Records Found
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.date}</td>
                  <td>{rec.status}</td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Attendance;
