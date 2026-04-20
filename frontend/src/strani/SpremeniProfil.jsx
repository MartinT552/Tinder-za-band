import { useEffect, useState } from "react";

export default function SpremeniProfil() {
  const [user, setUser] = useState({
    ime: "",
    email: "",
    telefon: "",
    instrument: "",
    kraj_Id: ""
  });

  const [kraji, setKraji] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const instrumenti = [
      "Kitara",
  "Bas",
  "Bobni",
  "Klavir",
  "Sintisajzer",
  "Violina",
  "Saksofon",
  "Trobenta",
  "Flavta",
  "Harmonika",
  "Ukulele",
  "Mandolina",
  "Čelo",
  "Kontrabas",
  "Harfa",
  "Klarinet",
  "Fagot",
  "Oboa",
  "Tuba",
  "Orgle"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Ni tokena");
        setLoading(false);
        return;
      }

      try {
        // 1. Pridobi kraje
        const resKraji = await fetch("https://localhost:7001/api/kraji");
        const krajiData = await resKraji.json();
        setKraji(krajiData);

        // 2. Pridobi uporabnika
        const resUser = await fetch("https://localhost:7001/api/Auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await resUser.json();

        // 🔹 LOG ZA RAZVIJALCA (Preveri to v konzoli!)
        console.log("Podatki uporabnika iz baze:", userData);

        setUser({
          ime: userData.ime || "",
          email: userData.email || "",
          telefon: userData.telefon || "",
          // Popravimo instrument na veliko začetnico, da se ujema s seznamom
          instrument: userData.instrument 
            ? userData.instrument.charAt(0).toUpperCase() + userData.instrument.slice(1).toLowerCase() 
            : "",
          // Nujno pretvorimo ID v STRING, da ga <select> prepozna
          kraj_Id: userData.kraj_id ? userData.kraj_id.toString() : ""
        });

      } catch (err) {
        console.error(err);
        setError("Napaka pri nalaganju podatkov");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("https://localhost:7001/api/Auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...user,
        kraj_Id: user.kraj_Id ? parseInt(user.kraj_Id) : null
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Status:", response.status);
      console.log("Napaka iz backenda:", errorText);
      throw new Error(errorText);
    }

    alert("Profil uspešno posodobljen!");
  } catch (err) {
    alert(err.message);
  }
};

  if (loading) return <div>Nalaganje...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page center-page">
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <h2>Uredi profil</h2>

          <input name="ime" value={user.ime} onChange={handleChange} placeholder="Ime" />
          <input name="email" value={user.email} onChange={handleChange} placeholder="Email" />
          <input name="telefon" value={user.telefon} onChange={handleChange} placeholder="Telefon" />

          {/* Instrument Dropdown */}
          <div className="select-wrapper">
            <label>Trenutno glasbilo:</label>
            <select name="instrument" value={user.instrument} onChange={handleChange}>
              <option value="">Izberi instrument</option>
              {instrumenti.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>

          {/* Kraj Dropdown */}
          <div className="select-wrapper">
            <label>Trenutni kraj:</label>
            <select name="kraj_Id" value={user.kraj_Id} onChange={handleChange}>
              <option value="">Izberi kraj</option>
              {kraji.map((k) => (
                <option key={k.id} value={k.id.toString()}>
                  {k.ime}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" style={{ marginTop: "20px" }}>Shrani spremembe</button>
        </form>
      </div>
    </div>
  );
}