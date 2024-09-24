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
// import Cookies from "js-cookie"

function App() {
  // const isAuthenticated = Cookies.get("authToken") !== undefined
  // const isAdmin = Cookies.get("adminUtilisateur") === "1"

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creer-partie" element={<CreateGame />} />
        <Route path="/association" element={<About />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/Cgu" element={<Cgu />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
        {/* Redirection si la route est incorrecte */}
      </Routes>
    </Router>
  )
}

export default App
