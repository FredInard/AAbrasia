// ProtectedRoute.jsx
import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

const ProtectedRoute = ({ requiredRole, children }) => {
  const { authData } = useContext(AuthContext)
  // isLoggedIn, userRole, userData
  if (authData.isLoading) {
    return <div>Chargement...</div>
  }

  if (!authData.isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && authData.role !== requiredRole) {
    return <Navigate to="/not-authorized" />
  }

  return children
}

export default ProtectedRoute
