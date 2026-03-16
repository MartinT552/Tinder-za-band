import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    ime: "",
    email: "",
    telefon: "",
    instrument: "",
    kraj_Id: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Test");
  };

  return (
    <div className="page center-page">
      <div className="form-card">
        <form onSubmit={handleRegister} className="form">
          <h2>Registracija</h2>

          <input name="ime" placeholder="Ime" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="telefon" placeholder="Telefon" onChange={handleChange} />
          <input name="instrument" placeholder="Instrument" onChange={handleChange} />
          <input name="kraj_Id" placeholder="Kraj ID" onChange={handleChange} />
          <input name="password" type="password" placeholder="Geslo" onChange={handleChange} />

          <button type="submit">Registracija</button>

          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}