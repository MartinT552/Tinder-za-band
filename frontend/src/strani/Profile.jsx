import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Ni tokena");
        return;
      }

      const response = await fetch("https://localhost:7001/api/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
      } else {
        console.log(data);
      }
    };

    fetchProfile();

  }, []);

  return (
    <div>
      <h2>Profil uporabnika</h2>

      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Ime: {user.ime}</p>
          <p>Email: {user.email}</p>
          <button onClick={() => navigate("/spremeniProfil")}>
            Spremeni Profil
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  );
}