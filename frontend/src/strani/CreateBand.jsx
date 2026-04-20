import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Band() {
  const [band, setBand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kraji, setKraji] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    ime: "", opis: "", kraj_Id: "", slika: null
  });
  const [objavaOdprta, setObjavaOdprta] = useState(false);
  const [objavaOpis, setObjavaOpis] = useState("");
  const [objavaMsg, setObjavaMsg] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const [bandRes, krajiRes] = await Promise.all([
        fetch("https://localhost:7001/api/band/moj", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("https://localhost:7001/api/kraji")
      ]);

      const krajiJson = await krajiRes.json();
      setKraji(krajiJson);

      if (bandRes.ok) {
        const bandJson = await bandRes.json();
        setBand(bandJson);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, slika: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("ime", form.ime);
    formData.append("opis", form.opis);
    if (form.kraj_Id) formData.append("kraj_Id", parseInt(form.kraj_Id, 10));
    if (form.slika) formData.append("slika", form.slika);

    try {
      const response = await fetch("https://localhost:7001/api/band", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (!response.ok) {
        setMessage(typeof data === "string" ? data : "Napaka pri ustvarjanju benda.");
        return;
      }

      setBand(data);
      setMessage("Band uspešno ustvarjen!");
    } catch (err) {
      setMessage(`Napaka: ${err.message}`);
    }
  };

  const handleUstvariObjavo = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7001/api/band/objava", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ opis: objavaOpis })
      });

      if (response.ok) {
        setObjavaMsg("Objava uspešno ustvarjena!");
        setObjavaOpis("");
        setObjavaOdprta(false);
      } else {
        const text = await response.text();
        setObjavaMsg(text || "Napaka pri ustvarjanju objave.");
      }
    } catch (err) {
      setObjavaMsg(`Napaka: ${err.message}`);
    }
  };

  const userKraj = kraji.find(k => k.id === band?.kraj_id);

  if (loading) return <div className="page center-page"><p>Loading...</p></div>;

  return (
    <div className="page center-page">
      {band ? (
        <div className="profile-card">
          <h2>Moj Band</h2>
          <div className="profile-info">

            {band.slike && (
              <div className="profile-row" style={{ justifyContent: "center" }}>
                <img
                  src={`https://localhost:7001${band.slike}`}
                  alt="Slika benda"
                  style={{ width: "120px", height: "120px", borderRadius: "12px", objectFit: "cover" }}
                />
              </div>
            )}

            <div className="profile-row">
              <span className="profile-label">Ime</span>
              <span className="profile-value">{band.ime}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Opis</span>
              <span className="profile-value">{band.opis || "Ni opisa"}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Kraj</span>
              <span className="profile-value">{userKraj ? userKraj.ime : "Ni podatka"}</span>
            </div>

            {/* Objava */}
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setObjavaOdprta(!objavaOdprta)}>
                {objavaOdprta ? "Zapri" : "Ustvari objavo"}
              </button>

              {objavaOdprta && (
                <form onSubmit={handleUstvariObjavo} className="form" style={{ marginTop: "16px" }}>
                  <textarea
                    placeholder="Katere glasbenike iščete..."
                    value={objavaOpis}
                    onChange={(e) => setObjavaOpis(e.target.value)}
                    rows={3}
                    style={{ resize: "none" }}
                    required
                  />
                  <button type="submit">Objavi</button>
                </form>
              )}

              {objavaMsg && <p style={{ marginTop: "8px" }}>{objavaMsg}</p>}
            </div>

          </div>
        </div>
      ) : (
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form">
            <h2>Ustvari Band</h2>

            <input
              name="ime"
              placeholder="Ime benda"
              value={form.ime}
              onChange={handleChange}
              required
            />

            <textarea
              name="opis"
              placeholder="Opis benda"
              value={form.opis}
              onChange={handleChange}
              rows={4}
              style={{ resize: "none" }}
            />

            <div className="select-wrapper">
              <select
                name="kraj_Id"
                value={form.kraj_Id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Izberi kraj</option>
                {kraji.map((kraj) => (
                  <option key={kraj.id} value={kraj.id}>{kraj.ime}</option>
                ))}
              </select>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button type="submit">Ustvari Band</button>
            <p>{message}</p>
          </form>
        </div>
      )}
    </div>
  );
}