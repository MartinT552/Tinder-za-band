
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./strani/Home";
import Login from "./strani/Login";
import Register from "./strani/Register";
import Profile from "./strani/Profile";
import Navbar from "./komponenti/Navbar";
import "./css/App.css";
import SpremeniProfil from "./strani/SpremeniProfil";


function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/spremeniProfil" element={<SpremeniProfil />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

