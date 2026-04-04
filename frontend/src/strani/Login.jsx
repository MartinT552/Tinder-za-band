import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Napaka pri prijavi.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Prijava uspešna!");
      const navigate = useNavigate();
      navigate("/profile");
    } catch (error) {
      console.error(error);
      setMessage("Backend ni dosegljiv.");
    }
  };

  return (
    <div className="page center-page">
      <div className="form-card">
        <form onSubmit={handleLogin} className="form">
          <h2>Prijava</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Prijava</button>

          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}