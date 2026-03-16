import { useEffect, useState } from "react";

export default function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const fetchProfile = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Ni tokena");
        return;
      }

      const response = await fetch("https://localhost:7247/api/auth/me", {
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
        </div>
      ) : (
        <p>Loading...</p>
      )}

    </div>
  );
}