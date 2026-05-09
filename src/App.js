import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import HomePage from "./pages/HomePage";
import PhotoboothPage from "./pages/PhotoboothPage";
import GiftGeneratorPage from "./pages/GiftGeneratorPage";
import GiftWebPage from "./pages/GiftWebPage";
import NglPage from "./pages/NglPage";
import NglInboxPage from "./pages/NglInboxPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage"; // <--- TAMBAHKAN IMPORT INI
import Navbar from "./components/Navbar";

import "./styles/index.css"; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen noise-overlay">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/photobooth" element={<PhotoboothPage />} />
            <Route path="/gift" element={<GiftGeneratorPage />} />
            <Route path="/g/:slug" element={<GiftWebPage />} />
            <Route path="/ngl/:slug" element={<NglPage />} />
            <Route path="/inbox" element={<NglInboxPage />} />
            
            {/* PINTO LOGIN BARU */}
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;