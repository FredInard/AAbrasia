// App.jsx
import "./App.scss"
import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Home from "./pages/Home"
import CreateGame from "./pages/CreateGame"
import About from "./pages/Association"
import LoginSignup from "./pages/LoginSignup"
import Cgu from "./pages/Cgu"
import Profil from "./pages/Profil"
import { AuthProvider } from "./AuthContext"
import ProtectedRoute from "./ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques accessibles à tous */}
          <Route path="/" element={<Home />} />
          <Route path="/association" element={<About />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/Cgu" element={<Cgu />} />

          {/* Routes protégées accessibles uniquement aux utilisateurs authentifiés */}
          <Route
            path="/creer-partie"
            element={
              <ProtectedRoute requiredRole="user">
                <CreateGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute requiredRole="user">
                <Profil />
              </ProtectedRoute>
            }
          />

          {/* Route protégée pour l'administrateur (à créer) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                {/* Remplace par ton composant AdminPage */}
                <div>Page d'administration (à créer)</div>
              </ProtectedRoute>
            }
          />

          {/* Redirection si la route est incorrecte */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
