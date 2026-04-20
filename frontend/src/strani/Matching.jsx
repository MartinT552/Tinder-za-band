import { useEffect, useState } from "react";

export default function Matching() {
  const [mode, setMode] = useState(null);
  const [bandId, setBandId] = useState(null);
  const [cards, setCards] = useState([]);
  const [zainteresirani, setZainteresirani] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingInterested, setLoadingInterested] = useState(false);
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
    if (mode !== null) {
      fetchCards();
      fetchZainteresirani();
    }
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

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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
    } catch (error) {
      setMessage("Napaka pri povezavi z backendom.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchZainteresirani = async () => {
    setLoadingInterested(true);
    try {
      let url = "";
      if (mode === "glasbenik") {
        url = `https://localhost:7001/api/matching/zainteresirani-bandi/${userId}`;
      } else {
        url = `https://localhost:7001/api/matching/zainteresirani-uporabniki/${bandId}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setZainteresirani(data);
      }
    } catch (error) {
      console.error("Napaka pri nalaganju zainteresiranih:", error);
    } finally {
      setLoadingInterested(false);
    }
  };

  const handleDecision = async (item, dolocitev) => {
    try {
      let url = "";
      let body = {};

      if (mode === "glasbenik") {
        url = "https://localhost:7001/api/matching/glasbenik-oceni-objavo";
        body = { uporabnikId: userId, objavaId: item.id, dolocitev };
      } else {
        url = "https://localhost:7001/api/matching/band-oceni-uporabnika";
        body = { bandId, uporabnikId: item.id, dolocitev };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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
        alert("MATCH! 🎸 Pojdi na stran Matches za kontakt podatke!");
      }

      setCards((prev) => prev.filter((x) => x.id !== item.id));
      fetchZainteresirani();
      
      setTimeout(() => {
        if (cards.length <= 1) {
          fetchCards();
        }
      }, 500);
      
    } catch (error) {
      alert("Napaka pri povezavi z backendom.");
    }
  };

  const handleLikeFromInterested = async (item, dolocitev) => {
    try {
      let url = "";
      let body = {};

      if (mode === "glasbenik") {
        url = "https://localhost:7001/api/matching/glasbenik-oceni-objavo";
        body = { uporabnikId: userId, objavaId: item.objava_id, dolocitev };
      } else {
        url = "https://localhost:7001/api/matching/band-oceni-uporabnika";
        body = { bandId, uporabnikId: item.uporabnik_id, dolocitev };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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
        alert("MATCH! 🎸 Pojdi na stran Matches za kontakt podatke!");
      }

      if (mode === "glasbenik") {
        setZainteresirani((prev) => prev.filter((x) => x.objava_id !== item.objava_id));
      } else {
        setZainteresirani((prev) => prev.filter((x) => x.uporabnik_id !== item.uporabnik_id));
      }
      
      fetchCards();
      
    } catch (error) {
      alert("Napaka pri povezavi z backendom.");
    }
  };

  const handleDislikeFromInterested = async (item, dolocitev) => {
    try {
      let url = "";
      let body = {};

      if (mode === "glasbenik") {
        url = "https://localhost:7001/api/matching/glasbenik-oceni-objavo";
        body = { uporabnikId: userId, objavaId: item.objava_id, dolocitev: "dislike" };
      } else {
        url = "https://localhost:7001/api/matching/band-oceni-uporabnika";
        body = { bandId, uporabnikId: item.uporabnik_id, dolocitev: "dislike" };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const text = await response.text();
        alert(text);
        return;
      }

      if (mode === "glasbenik") {
        setZainteresirani((prev) => prev.filter((x) => x.objava_id !== item.objava_id));
      } else {
        setZainteresirani((prev) => prev.filter((x) => x.uporabnik_id !== item.uporabnik_id));
      }
      
    } catch (error) {
      alert("Napaka pri povezavi z backendom.");
    }
  };

  return (
    <div className="page">
      <div className="matching-wrapper" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Glavne kartice za ocenjevanje */}
        <div className="hero-card" style={{ maxWidth: "900px", width: "100%", margin: "0 auto 40px auto" }}>
          <h1>
            {mode === "band" ? "Poišči glasbenike za tvoj band" : "Najdi svojo glasbeno bando"}
          </h1>
          <p style={{ marginBottom: "32px" }}>
            {mode === "band" 
              ? "Oceni glasbenike v tvojem kraju in najdi popolne člane za svojo skupino"
              : "Poveži se z glasbeniki, poišči člane za svojo skupino in ustvari nove glasbene zgodbe"}
          </p>

          {loading ? (
            <p>Nalaganje kartic...</p>
          ) : message ? (
            <div className="form-card" style={{ marginTop: "20px" }}>
              <p>{message}</p>
              <button 
                onClick={fetchCards} 
                style={{ marginTop: "16px", padding: "10px 20px", cursor: "pointer" }}
              >
                Poskusi znova
              </button>
            </div>
          ) : cards.length === 0 ? (
            <div className="form-card" style={{ marginTop: "20px" }}>
              <p>Ni več kartic za prikaz. Pridi kasneje nazaj!</p>
              <button 
                onClick={fetchCards} 
                style={{ marginTop: "16px", padding: "10px 20px", cursor: "pointer" }}
              >
                Osveži
              </button>
            </div>
          ) : (
            <div className="matching-grid" style={{ marginTop: "32px" }}>
              {mode === "glasbenik" && cards.map((item) => (
                <div className="match-card" key={item.id}>
                  {item.band_slike && (
                    <img
                      src={`https://localhost:7001${item.band_slike}`}
                      alt="Band slika"
                      className="match-image"
                    />
                  )}
                  <h3>{item.band_ime}</h3>
                  <p><strong>Opis benda:</strong> {item.band_opis || "Ni opisa."}</p>
                  <p><strong>Kaj iščejo:</strong> {item.opis || "Ni opisa."}</p>
                  <div className="match-actions">
                    <button className="dislike-btn" onClick={() => handleDecision(item, "dislike")}>❌ Ne</button>
                    <button className="like-btn" onClick={() => handleDecision(item, "like")}>❤️ Like</button>
                  </div>
                </div>
              ))}

              {mode === "band" && cards.map((item) => (
                <div className="match-card" key={item.id}>
                  {item.slika && (
                    <img
                      src={`https://localhost:7001${item.slika}`}
                      alt="Profilna slika"
                      className="match-image"
                      style={{ width: "100px", height: "100px", borderRadius: "50%", margin: "0 auto 16px auto", display: "block" }}
                    />
                  )}
                  <h3>{item.ime}</h3>
                  <p><strong>Instrument:</strong> {item.instrument || "Ni podatka."}</p>
                  <p><strong>Bio:</strong> {item.bio || "Ni opisa."}</p>
                  <div className="match-actions">
                    <button className="dislike-btn" onClick={() => handleDecision(item, "dislike")}>❌ Ne</button>
                    <button className="like-btn" onClick={() => handleDecision(item, "like")}>❤️ Like</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sekcija: Zainteresirani */}
        {!loadingInterested && zainteresirani.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "24px", color: "var(--accent)" }}>
              {mode === "glasbenik" ? "🎸 Bendi, ki so zainteresirani zate" : "🎸 Glasbeniki, ki so zainteresirani za tvoj band"}
            </h2>
            <p style={{ textAlign: "center", marginBottom: "24px", color: "var(--muted)" }}>
              {mode === "glasbenik" 
                ? "Ti bendi so ti dali like. Klikni like, da ustvariš match!" 
                : "Ti glasbeniki so dali like tvojemu bandu. Klikni like, da ustvariš match!"}
            </p>
            <div className="matching-grid">
              {mode === "glasbenik" && zainteresirani.map((item, index) => (
                <div className="match-card" key={index} style={{ borderColor: "var(--accent)", borderWidth: "2px" }}>
                  {item.band_slike && (
                    <img
                      src={`https://localhost:7001${item.band_slike}`}
                      alt="Band slika"
                      className="match-image"
                    />
                  )}
                  <h3>{item.band_ime}</h3>
                  <p><strong>Opis benda:</strong> {item.band_opis || "Ni opisa."}</p>
                  <p><strong>Kaj iščejo:</strong> {item.objava_opis || "Ni opisa."}</p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                    Like dobil: {new Date(item.like_datum).toLocaleDateString()}
                  </p>
                  <div className="match-actions">
                    <button 
                      className="dislike-btn" 
                      onClick={() => handleDislikeFromInterested(item, "dislike")}
                    >
                      ❌ Zavrni
                    </button>
                    <button 
                      className="like-btn" 
                      onClick={() => handleLikeFromInterested(item, "like")}
                    >
                      ❤️ Like nazaj
                    </button>
                  </div>
                </div>
              ))}

              {mode === "band" && zainteresirani.map((item, index) => (
                <div className="match-card" key={index} style={{ borderColor: "var(--accent)", borderWidth: "2px" }}>
                  {item.slika && (
                    <img
                      src={`https://localhost:7001${item.slika}`}
                      alt="Profilna slika"
                      style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px auto", display: "block" }}
                    />
                  )}
                  <h3>{item.ime}</h3>
                  <p><strong>Instrument:</strong> {item.instrument || "Ni podatka."}</p>
                  <p><strong>Bio:</strong> {item.bio || "Ni opisa."}</p>
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                    Like dobil: {new Date(item.like_datum).toLocaleDateString()}
                  </p>
                  <div className="match-actions">
                    <button 
                      className="dislike-btn" 
                      onClick={() => handleDislikeFromInterested(item, "dislike")}
                    >
                      ❌ Zavrni
                    </button>
                    <button 
                      className="like-btn" 
                      onClick={() => handleLikeFromInterested(item, "like")}
                    >
                      ❤️ Like nazaj
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loadingInterested && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>Nalaganje zainteresiranih...</p>
          </div>
        )}
      </div>
    </div>
  );
}