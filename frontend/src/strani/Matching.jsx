import { useEffect, useState } from "react";

export default function Matching() {
  const [mode, setMode] = useState("glasbenik");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const testBandId = 1;

  useEffect(() => {
    fetchCards();
  }, [mode]);

  const fetchCards = async () => {
    setLoading(true);
    setMessage("");

    try {
      const storedUser = localStorage.getItem("user");
      console.log("storedUser:", storedUser);

      if (!storedUser) {
        setMessage("Uporabnik ni prijavljen.");
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      console.log("parsedUser:", parsedUser);

      const userId = parsedUser.id || parsedUser.Id;
      console.log("userId:", userId);

      let url = "";

      if (mode === "glasbenik") {
        url = `https://localhost:7001/api/matching/objave-za-uporabnika/${userId}`;
      } else {
        url = `https://localhost:7001/api/matching/uporabniki-za-band/${testBandId}`;
      }

      console.log("FETCH URL:", url);

      const response = await fetch(url);
      console.log("STATUS:", response.status);

      const text = await response.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!response.ok) {
        setMessage(typeof data === "string" ? data : "Napaka pri nalaganju.");
        setCards([]);
        return;
      }

      setCards(data);
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setMessage("Napaka pri povezavi z backendom.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (item, dolocitev) => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id || parsedUser.Id;

      let url = "";
      let body = {};

      if (mode === "glasbenik") {
        url = "https://localhost:7001/api/matching/glasbenik-oceni-objavo";
        body = {
          uporabnikId: userId,
          objavaId: item.id,
          dolocitev
        };
      } else {
        url = "https://localhost:7001/api/matching/band-oceni-uporabnika";
        body = {
          bandId: testBandId,
          uporabnikId: item.id,
          dolocitev
        };
      }

      console.log("POST URL:", url);
      console.log("POST BODY:", body);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const text = await response.text();
      console.log("POST RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!response.ok) {
        alert(typeof data === "string" ? data : "Napaka pri shranjevanju.");
        return;
      }

      if (data.isMatch) {
        alert("MATCH! 🎸");
      }

      setCards((prev) => prev.filter((x) => x.id !== item.id));
    } catch (error) {
      console.error("POST ERROR:", error);
      alert("Napaka pri povezavi z backendom.");
    }
  };

  return (
    <div className="page">
      <div className="matching-wrapper">
        <div className="matching-header">
          <h2 className="matching-title">Matching</h2>

          <div className="matching-switch">
            <button
              className={mode === "glasbenik" ? "active-mode" : ""}
              onClick={() => setMode("glasbenik")}
            >
              Glasbenik
            </button>
            <button
              className={mode === "band" ? "active-mode" : ""}
              onClick={() => setMode("band")}
            >
              Band
            </button>
          </div>
        </div>

        {loading ? (
          <div className="form-card">
            <p>Nalaganje...</p>
          </div>
        ) : message ? (
          <div className="form-card">
            <p>{message}</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="form-card">
            <p>Ni več kartic za prikaz.</p>
          </div>
        ) : (
          <div className="matching-grid">
            {mode === "glasbenik" &&
              cards.map((item) => (
                <div className="match-card" key={item.id}>
                  <h3>{item.band_ime}</h3>
                  <p><strong>Opis objave:</strong> {item.opis || "Ni opisa."}</p>
                  <p><strong>Opis banda:</strong> {item.band_opis || "Ni opisa."}</p>

                  <div className="match-actions">
                    <button
                      className="dislike-btn"
                      onClick={() => handleDecision(item, "dislike")}
                    >
                      Dislike
                    </button>
                    <button
                      className="like-btn"
                      onClick={() => handleDecision(item, "like")}
                    >
                      Like
                    </button>
                  </div>
                </div>
              ))}

            {mode === "band" &&
              cards.map((item) => (
                <div className="match-card" key={item.id}>
                  <h3>{item.ime}</h3>
                  <p><strong>Instrument:</strong> {item.instrument || "Ni podatka."}</p>
                  <p><strong>Žanr:</strong> {item.zanr || "Ni podatka."}</p>
                  <p><strong>Bio:</strong> {item.bio || "Ni opisa."}</p>

                  <div className="match-actions">
                    <button
                      className="dislike-btn"
                      onClick={() => handleDecision(item, "dislike")}
                    >
                      Dislike
                    </button>
                    <button
                      className="like-btn"
                      onClick={() => handleDecision(item, "like")}
                    >
                      Like
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}