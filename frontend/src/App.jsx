import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./strani/Login";
import Register from "./strani/Register";
import Profile from "./strani/Profile";
import Navbar from "./komponenti/Navbar";
import "./css/App.css";
import SpremeniProfil from "./strani/SpremeniProfil";
import Matching from "./strani/Matching";
import Matches from "./strani/Matches";
import CreateBand from "./strani/CreateBand";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<ProtectedRoute><Matching /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/spremeniProfil" element={<ProtectedRoute><SpremeniProfil /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/band" element={<ProtectedRoute><CreateBand /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;