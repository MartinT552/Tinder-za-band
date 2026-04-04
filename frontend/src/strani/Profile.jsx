import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [user, setUser] = useState(null);
  const [kraji, setKraji] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Ni tokena");
        return;
      }

      const [userData, krajiData] = await Promise.all([
        fetch("https://localhost:7001/api/Auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("https://localhost:7001/api/kraji")
      ]);

      const userJson = await userData.json();
      const krajiJson = await krajiData.json();

      setUser(userJson);
      setKraji(krajiJson);
    };

    fetchProfile();
  }, []);

  const userKraj = kraji.find(k => k.id === user?.kraj_id);

  return (
    <div className="page center-page">
      <div className="profile-card">
        <h2>Profil uporabnika</h2>

        {user ? (
          <div className="profile-info">

           {user.slika && (
      <div className="profile-row" style={{ justifyContent: "center" }}>
        <img
          src={`https://localhost:7001${user.slika}`}
          alt="Profilna slika"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
        />
      </div>
    )}
            <div className="profile-row">
              <span className="profile-label">Ime</span>
              <span className="profile-value">{user.ime}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>


            <div className="profile-row">
              <span className="profile-label">Telefon</span>
              <span className="profile-value">{user.telefon || "Ni podatka"}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Instrument</span>
              <span className="profile-value">{user.instrument || "Ni podatka"}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Kraj</span>
              <span className="profile-value">{userKraj ? userKraj.ime : "Ni podatka"}</span>
            </div>

            <button onClick={() => navigate("/spremeniProfil")}>
              Spremeni profil
            </button>

          </div>
        ) : (
          <p className="profile-loading">Loading...</p>
        )}
      </div>
    </div>
  );
}