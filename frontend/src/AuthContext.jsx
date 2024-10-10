import React, { createContext, useState, useEffect } from "react"
import * as jwtDecode from "jwt-decode" // Importation corrigée

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("visitor")
  const [userData, setUserData] = useState(null)

  const logout = () => {
    localStorage.removeItem("authToken")
    setIsLoggedIn(false)
    setUserRole("visitor")
    setUserData(null)
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        const decodedToken = jwtDecode.default(token) // Utilisation de .default
        setIsLoggedIn(true)
        setUserRole(decodedToken.role)
        setUserData(decodedToken)
      } catch (error) {
        console.error("Token invalide :", error)
        setIsLoggedIn(false)
        setUserRole("visitor")
        setUserData(null)
      }
    } else {
      setIsLoggedIn(false)
      setUserRole("visitor")
      setUserData(null)
    }
  }, [])

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
    userData,
    setUserData,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
