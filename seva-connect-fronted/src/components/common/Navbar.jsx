import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <Link to="/" style={{ marginRight: "15px" }}>SevaConnect</Link>
      <Link to="/about">About</Link>
      <Link to="/services" style={{ marginLeft: "10px" }}>Services</Link>
      <Link to="/contact" style={{ marginLeft: "10px" }}>Contact</Link>

      <div style={{ float: "right" }}>
        {!token ? (
          <>
            <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/user/home" style={{ marginRight: "10px" }}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;