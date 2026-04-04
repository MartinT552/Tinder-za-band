import { useState, useEffect } from "react";

export default function Register() {
  const [form, setForm] = useState({
    ime: "",
    email: "",
    telefon: "",
    instrument: "",
    kraj_Id: "",
    password: "",
    slika: null
  });

  const handleFileChange = (e) => {
  setForm({ ...form, slika: e.target.files[0] });
};
  const [kraji, setKraji] = useState([]);
  const [message, setMessage] = useState("");
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
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetch("https://localhost:7001/api/kraji")
      .then((res) => res.json())
      .then((data) => setKraji(data))
      .catch((err) =>
        console.error("Napaka pri nalaganju krajev:", err)
      );
  }, []);

const handleRegister = async (e) => {
  e.preventDefault();

  if (form.password.length < 6) {
    setMessage("Geslo mora imeti vsaj 6 znakov.");
    return;
  }

  const formData = new FormData();
  formData.append("ime", form.ime);
  formData.append("email", form.email);
  formData.append("telefon", form.telefon);
  formData.append("instrument", form.instrument);
  if (form.kraj_Id) formData.append("kraj_Id", parseInt(form.kraj_Id, 10));
  formData.append("password", form.password);
  if (form.slika) formData.append("slika", form.slika);

  try {
    const response = await fetch("https://localhost:7001/api/auth/register", {
      method: "POST",
      body: formData
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      setMessage(typeof data === "string" ? data : "Napaka pri registraciji.");
      return;
    }

    setMessage("Registracija uspešna!");
    location.href = "../Profile";
  } catch (err) {
    console.error("Fetch napaka:", err.message);
    setMessage(`Napaka: ${err.message}`);
  }
};

  return (
    <div className="page center-page">
      <div className="form-card">
        <form onSubmit={handleRegister} className="form">
          <h2>Registracija</h2>

          <input
            name="ime"
            placeholder="Ime"
            value={form.ime}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="telefon"
            placeholder="Telefon"
            value={form.telefon}
            onChange={handleChange}
          />

    
          <div className="select-wrapper">
            <select
              name="instrument"
              value={form.instrument}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Izberi instrument
              </option>
              {instrumenti.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <select
              name="kraj_Id"
              value={form.kraj_Id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Izberi kraj
              </option>
              {kraji.map((kraj) => (
                <option key={kraj.id} value={kraj.id}>
                  {kraj.ime}
                </option>
              ))}
            </select>
          </div>

          <input
            name="password"
            type="password"
            placeholder="Geslo"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="slika"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <button type="submit">Registracija</button>

          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}