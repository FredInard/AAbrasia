// ProtectedRoute.jsx
import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

// Fonction pour vérifier si l'utilisateur a le rôle requis ou un rôle supérieur
const hasRequiredRole = (userRole, requiredRole) => {
  const roleHierarchy = ["membre", "admin"]
  return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(requiredRole)
}

const ProtectedRoute = ({ children, requiredRole }) => {
  const { authData } = useContext(AuthContext)

  if (authData.isLoading) {
    return <p>Chargement...</p>
  }

  if (!authData.isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!hasRequiredRole(authData.role, requiredRole)) {
    return <Navigate to="/" /> // Redirection vers la page d'accueil si accès refusé
  }

  return children
}

export default ProtectedRoute
