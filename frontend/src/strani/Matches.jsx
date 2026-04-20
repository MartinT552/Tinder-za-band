import { useEffect, useState } from "react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState(null);

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.id || parsedUser?.Id;

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userId) {
        setMessage("Uporabnik ni prijavljen.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://localhost:7001/api/matching/vsi-matchi/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data || "Napaka pri nalaganju matchov.");
          setLoading(false);
          return;
        }

        setMatches(data);

        const bandRes = await fetch("https://localhost:7001/api/band/moj", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMode(bandRes.ok ? "band" : "glasbenik");
      } catch (error) {
        setMessage("Napaka pri povezavi z backendom.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId]);

  return (
    <div className="page center-page">
      <div className="hero-card" style={{ maxWidth: "1000px", width: "100%" }}>
        <h1>Moji Matchi 🎸</h1>
        <p style={{ marginBottom: "32px" }}>
          Tukaj so vsi glasbeniki in bendi, s katerimi ste povezani
        </p>

        {loading ? (
          <p>Nalaganje matchov...</p>
        ) : message ? (
          <div className="form-card">
            <p>{message}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="form-card">
            <p>Še nimaš nobenega matcha. Začni z ocenjevanjem na strani Matching!</p>
          </div>
        ) : (
          <div className="matching-grid">
            {mode === "glasbenik" && matches.map((match, index) => (
              <div className="match-card" key={index} style={{ borderColor: "var(--accent)" }}>
                {match.band_slike && (
                  <img
                    src={`https://localhost:7001${match.band_slike}`}
                    alt="Band slika"
                    className="match-image"
                  />
                )}
                <h3>{match.band_ime}</h3>
                <p><strong>Opis benda:</strong> {match.band_opis || "Ni opisa."}</p>
                
                <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "16px 0" }} />
                
                <h4 style={{ marginBottom: "12px", color: "var(--accent)" }}>Kontakt podatki lastnika banda:</h4>
                {match.owner_slika && (
                  <img
                    src={`https://localhost:7001${match.owner_slika}`}
                    alt="Owner slika"
                    style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px" }}
                  />
                )}
                <p><strong>Ime:</strong> {match.owner_ime}</p>
                <p><strong>Email:</strong> <a href={`mailto:${match.owner_email}`} style={{ color: "var(--accent)" }}>{match.owner_email}</a></p>
                <p><strong>Telefon:</strong> <a href={`tel:${match.owner_telefon}`} style={{ color: "var(--accent)" }}>{match.owner_telefon}</a></p>
                <p><strong>Instrument:</strong> {match.owner_instrument || "Ni podatka"}</p>
                <p><strong>Kraj:</strong> {match.kraj_ime || "Ni podatka"}</p>
                
                <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
                  Match dosežen: {new Date(match.datum_matcha).toLocaleDateString()}
                </p>
              </div>
            ))}

            {mode === "band" && matches.map((match, index) => (
              <div className="match-card" key={index} style={{ borderColor: "var(--accent)" }}>
                {match.slika && (
                  <img
                    src={`https://localhost:7001${match.slika}`}
                    alt="Profilna slika"
                    style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px auto", display: "block" }}
                  />
                )}
                <h3>{match.ime}</h3>
                <p><strong>Instrument:</strong> {match.instrument || "Ni podatka"}</p>
                <p><strong>Žanr:</strong> {match.zanr || "Ni podatka"}</p>
                <p><strong>Bio:</strong> {match.bio || "Ni opisa"}</p>
                
                <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "16px 0" }} />
                
                <h4 style={{ marginBottom: "12px", color: "var(--accent)" }}>Kontakt podatki:</h4>
                <p><strong>Email:</strong> <a href={`mailto:${match.email}`} style={{ color: "var(--accent)" }}>{match.email}</a></p>
                <p><strong>Telefon:</strong> <a href={`tel:${match.telefon}`} style={{ color: "var(--accent)" }}>{match.telefon}</a></p>
                <p><strong>Kraj:</strong> {match.kraj_ime || "Ni podatka"}</p>
                
                <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
                  Match dosežen: {new Date(match.datum_matcha).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}