import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">TinderZaBende</h2>
      <div className="nav-links">
        <Link to="/">Domov</Link>
        <Link to="/login">Prijava</Link>
        <Link to="/register">Registracija</Link>
      </div>
    </nav>
  );
}

export default Navbar;