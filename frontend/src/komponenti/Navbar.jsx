import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">TinderZaBende</h2>
      <div className="nav-links">
        <Link to="/">Domov</Link>
        {token ? (
          <>
            <Link to="/profile">Profil</Link>
            <Link to="/matching">Matching</Link>
            <button onClick={handleLogout}>Odjava</button>
          </>
        ) : (
          <>
            <Link to="/login">Prijava</Link>
            <Link to="/register">Registracija</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;