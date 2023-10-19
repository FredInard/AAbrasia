// import React from "react"

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import Home from "./pages/Home"
// import Inscription from "./pages/Inscription"
// import CreateGame from "./pages/CreateGame"
// import Creations from "./pages/Creations"
// import Association from "./pages/Association"
// import Profil from "./pages/Profil"

// import "./App.css"

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/Inscription" element={<Inscription />} />
//         <Route path="/create-game" element={<CreateGame />} />
//         <Route path="/creations" element={<Creations />} />
//         <Route path="/association" element={<Association />} />
//         <Route path="/profil" element={<Profil />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App

import "./App.css"

import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import Home from "./pages/Home"
import Inscription from "./pages/Inscription"
import CreateGame from "./pages/CreateGame"
import Creations from "./pages/Creations"
import Association from "./pages/Association"
import Profil from "./pages/Profil"
import Cookies from "js-cookie"

function App() {
  const isAuthenticated = Cookies.get("authToken") !== undefined

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Inscription" element={<Inscription />} />
        <Route
          path="/create-game"
          element={
            isAuthenticated ? <CreateGame /> : <Navigate to="/Inscription" />
          }
        />
        <Route path="/creations" element={<Creations />} />
        <Route path="/association" element={<Association />} />
        <Route
          path="/profil"
          element={
            isAuthenticated ? <Profil /> : <Navigate to="/Inscription" />
          }
        />
      </Routes>
    </Router>
  )
}

export default App
