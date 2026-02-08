import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const [stats, setStats] = useState({
    employees: 0,
    present: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------- FETCH STATS -----------

  const fetchStats = async () => {

    setLoading(true);
    setError("");

    try {
      const emp = await API.get("/stats/employees");
      const present = await API.get(
        "/stats/present-today"
      );

      setStats({
        employees: emp.data.total_employees,
        present: present.data.present_today
      });

    } catch (err) {
      console.error("Stats fetch error:", err);
      setError("Failed to load dashboard stats");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ----------- UI -----------

  return (
    <div className="page-container">

      {/* HERO SECTION */}
      <div className="hero-section">

        <h1>
          Manage workforce ✺ track attendance ✺
          build smarter HR systems
        </h1>

        <p>
          Lightweight internal HR platform for employee
          management and attendance monitoring.
        </p>

      </div>
      <div className="hero-buttons">

  <button className="primary-btn">
    Get Started →
  </button>

  <button className="secondary-btn">
    Explore Features
  </button>

</div>


      {/* LOADING + ERROR */}
      {loading && <p>Loading dashboard...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* STATS CARDS */}
      {!loading && !error && (

        <div className="stats-grid">

          <div className="stat-card">
            <p>Total Employees</p>
            <h2>{stats.employees}</h2>
          </div>

          <div className="stat-card">
            <p>Present Today</p>
            <h2>{stats.present}</h2>
          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;
