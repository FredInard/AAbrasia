// ProtectedRoute.jsx
import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

const ProtectedRoute = ({ requiredRole, children }) => {
  const { isLoggedIn, userRole, userData } = useContext(AuthContext)

  if (userData === null && isLoggedIn) {
    return <div>Chargement...</div>
  }

  if (!isLoggedIn && requiredRole !== "visitor") {
    return <Navigate to="/login" />
  }

  if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
    return <Navigate to="/not-authorized" />
  }

  return children
}

export default ProtectedRoute
