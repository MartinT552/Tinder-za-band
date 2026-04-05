import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./strani/Home";
import Login from "./strani/Login";
import Register from "./strani/Register";
import Profile from "./strani/Profile";
import Navbar from "./komponenti/Navbar";
import "./css/App.css";
import SpremeniProfil from "./strani/SpremeniProfil";
import Matching from "./strani/Matching";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/spremeniProfil" element={<ProtectedRoute><SpremeniProfil /></ProtectedRoute>} />
          <Route path="/matching" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;