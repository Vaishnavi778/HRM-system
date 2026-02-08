import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 60px",
        background: "#000",
        borderBottom: "1px solid #111",
      }}
    >

      <h2 style={{ fontWeight: 500 }}>
        HRMS Lite
      </h2>

      <div style={{ display: "flex", gap: "30px" }}>

        <Link to="/">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/attendance">Attendance</Link>

      </div>

    </nav>
  );
}

export default Navbar;
