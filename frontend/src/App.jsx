// require("dotenv").config();

import React from "react"

// import AuthContext from "./components/AuthContext/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Inscription from "./pages/Inscription"
import CreateGame from "./pages/CreateGame"
import Creations from "./pages/Creations"
import Association from "./pages/Association"
import Profil from "./pages/Profil"

import "./App.css"

function App() {
  // const [users, setUsers] = useState([])
  // const [user, setUser] = useState([])

  return (
    // <AuthContext.Provider
    //           value={{
    //             users,
    //             setUsers,
    //             user,
    //             setUser,
    //           }}
    // >
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Inscription" element={<Inscription />} />
        <Route path="/create-game" element={<CreateGame />} />
        <Route path="/creations" element={<Creations />} />
        <Route path="/association" element={<Association />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </Router>

    // </AuthContext.Provider>
  )
}

export default App
