import { useEffect, useState } from "react";

export default function Matching() {
  const [mode, setMode] = useState(null);
  const [bandId, setBandId] = useState(null);
  const [cards, setCards] = useState([]);
  const [matchi, setMatchi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.id || parsedUser?.Id;

  useEffect(() => {
    const checkBand = async () => {
      try {
        const res = await fetch("https://localhost:7001/api/band/moj", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const band = await res.json();
          setBandId(band.id);
          setMode("band");
        } else {
          setMode("glasbenik");
        }
      } catch {
        setMode("glasbenik");
      }
    };

    checkBand();
  }, []);

  useEffect(() => {
    if (mode !== null) fetchCards();
  }, [mode]);

  const fetchCards = async () => {
    setLoading(true);
    setMessage("");

    if (!userId) {
      setMessage("Uporabnik ni prijavljen.");
      setLoading(false);
      return;
    }

    try {
      let url = "";
      if (mode === "glasbenik") {
        url = `https://localhost:7001/api/matching/objave-za-uporabnika/${userId}`;
      } else {
        url = `https://localhost:7001/api/matching/uporabniki-za-band/${bandId}`;
      }

      const response = await fetch(url);
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (!response.ok) {
        setMessage(typeof data === "string" ? data : "Napaka pri nalaganju.");
        setCards([]);
        setLoading(false);
        return;
      }

      setCards(data);

      // Naloži matche
      const matchUrl = mode === "glasbenik"
        ? `https://localhost:7001/api/matching/moji-matchi/${userId}`
        : `https://localhost:7001/api/matching/moji-matchi-band/${bandId}`;

      const matchRes = await fetch(matchUrl);
      if (matchRes.ok) {
        const matchData = await matchRes.json();
        setMatchi(matchData);
      }

    } catch (error) {
      setMessage("Napaka pri povezavi z backendom.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

const handleDecision = async (item, dolocitev) => {
    try {
      let url = "";
      let body = {};

      console.log("item:", item);
      console.log("mode:", mode);
      console.log("bandId:", bandId);

      if (mode === "glasbenik") {
        url = "https://localhost:7001/api/matching/glasbenik-oceni-objavo";
        body = { uporabnikId: userId, objavaId: item.id, dolocitev };
      } else {
        url = "https://localhost:7001/api/matching/band-oceni-uporabnika";
        body = { bandId, uporabnikId: item.id, dolocitev };
      }

      console.log("body:", body);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }

      if (!response.ok) {
        alert(typeof data === "string" ? data : "Napaka pri shranjevanju.");
        return;
      }

      if (data.isMatch) {
        alert("MATCH! 🎸");
        const matchUrl = mode === "glasbenik"
          ? `https://localhost:7001/api/matching/moji-matchi/${userId}`
          : `https://localhost:7001/api/matching/moji-matchi-band/${bandId}`;

        const matchRes = await fetch(matchUrl);
        if (matchRes.ok) {
          const matchData = await matchRes.json();
          setMatchi(matchData);
        }
      }

      setCards((prev) => prev.filter((x) => x.id !== item.id));
    } catch (error) {
      alert("Napaka pri povezavi z backendom.");
    }
  };

  return (
    <div className="page">
      <div className="matching-wrapper">
        <div className="matching-header">
          <h2 className="matching-title">Matching</h2>
          <p style={{ color: "var(--muted)", marginTop: "4px" }}>
            {mode === "band" ? "Iščeš glasbenike za tvoj band" : "Iščeš band za sebe"}
          </p>
        </div>

        {loading ? (
          <div className="form-card"><p>Nalaganje...</p></div>
        ) : message ? (
          <div className="form-card"><p>{message}</p></div>
        ) : (
          <>
            {/* Kartice za ocenjevanje */}
            {cards.length === 0 ? (
              <div className="form-card"><p>Ni več kartic za prikaz.</p></div>
            ) : (
              <div className="matching-grid">
                {mode === "glasbenik" && cards.map((item) => (
                  <div className="match-card" key={item.id}>
                    {item.band_slike && (
                      <img
                        src={`https://localhost:7001${item.band_slike}`}
                        alt="Band slika"
                        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }}
                      />
                    )}
                    <h3>{item.band_ime}</h3>
                    <p><strong>Opis objave:</strong> {item.opis || "Ni opisa."}</p>
                    <p><strong>Opis banda:</strong> {item.band_opis || "Ni opisa."}</p>
                    <div className="match-actions">
                      <button className="dislike-btn" onClick={() => handleDecision(item, "dislike")}>Dislike</button>
                      <button className="like-btn" onClick={() => handleDecision(item, "like")}>Like</button>
                    </div>
                  </div>
                ))}

                {mode === "band" && cards.map((item) => (
                  <div className="match-card" key={item.id}>
                    {item.slika && (
                      <img
                        src={`https://localhost:7001${item.slika}`}
                        alt="Profilna slika"
                        style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px" }}
                      />
                    )}
                    <h3>{item.ime}</h3>
                    <p><strong>Instrument:</strong> {item.instrument || "Ni podatka."}</p>
                    <p><strong>Žanr:</strong> {item.zanr || "Ni podatka."}</p>
                    <p><strong>Bio:</strong> {item.bio || "Ni opisa."}</p>
                    <div className="match-actions">
                      <button className="dislike-btn" onClick={() => handleDecision(item, "dislike")}>Dislike</button>
                      <button className="like-btn" onClick={() => handleDecision(item, "like")}>Like</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Matchi */}
            {matchi.length > 0 && (
              <div style={{ marginTop: "40px" }}>
                <h3 style={{ color: "var(--text)", marginBottom: "16px" }}>Moji Matchi 🎸</h3>
                <div className="matching-grid">
                  {mode === "glasbenik" && matchi.map((m, i) => (
  <div className="match-card" key={i} style={{ borderColor: "var(--accent)" }}>
    {m.band_slike && (
      <img
        src={`https://localhost:7001${m.band_slike}`}
        alt="Band slika"
        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }}
      />
    )}
    <h3>{m.band_ime}</h3>
    <p>{m.band_opis || "Ni opisa."}</p>

    <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "12px 0" }} />

    <p style={{ fontWeight: "600", marginBottom: "6px" }}>Kontakt:</p>
    {m.owner_slika && (
      <img
        src={`https://localhost:7001${m.owner_slika}`}
        alt="Owner slika"
        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", marginBottom: "8px" }}
      />
    )}
    <p><strong>Ime:</strong> {m.owner_ime}</p>
    <p><strong>Email:</strong> {m.owner_email}</p>
    <p><strong>Telefon:</strong> {m.owner_telefon}</p>
    <p><strong>Instrument:</strong> {m.owner_instrument}</p>

    <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "8px" }}>
      Match: {new Date(m.datum_matcha).toLocaleDateString()}
    </p>
  </div>
))}

                  {mode === "band" && matchi.map((m, i) => (
                    <div className="match-card" key={i} style={{ borderColor: "var(--accent)" }}>
                      {m.slika && (
                        <img
                          src={`https://localhost:7001${m.slika}`}
                          alt="Profilna slika"
                          style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "12px" }}
                        />
                      )}
                      <h3>{m.ime}</h3>
                      <p><strong>Instrument:</strong> {m.instrument || "Ni podatka."}</p>
                      <p><strong>Žanr:</strong> {m.zanr || "Ni podatka."}</p>
                      <p><strong>Email:</strong> {m.email}</p>
                      <p><strong>Telefon:</strong> {m.telefon}</p>
                      <p style={{ color: "var(--muted)", fontSize: "12px" }}>
                        Match: {new Date(m.datum_matcha).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}