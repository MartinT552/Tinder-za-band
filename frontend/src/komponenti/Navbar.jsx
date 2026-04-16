import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">TinderZaBende</h2>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/">Domov</Link>
            <Link to="/profile">Profil</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/band">Band</Link>
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