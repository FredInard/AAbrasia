// src/components/AdminTabs/UsersTab.jsx

import React, { useState, useEffect } from "react"
import axios from "axios"
import "./UsersTab.scss"

const UsersTab = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    role: "membre",
    // Ajoutez d'autres champs si nécessaire
  })

  const authToken = localStorage.getItem("authToken")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = () => {
    setLoading(true)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs :", error)
        setError("Erreur lors du chargement des utilisateurs.")
        setLoading(false)
      })
  }

  const handleDelete = (userId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          fetchUsers()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de l'utilisateur :",
            error
          )
          setError("Erreur lors de la suppression de l'utilisateur.")
        })
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
      // Ajoutez d'autres champs si nécessaire
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    setFormData({
      pseudo: "",
      email: "",
      role: "membre",
      // Ajoutez d'autres champs si nécessaire
    })
    setIsCreating(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      // Mettre à jour l'utilisateur
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/utilisateurs/${selectedUser.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then(() => {
          setIsEditing(false)
          setSelectedUser(null)
          fetchUsers()
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la mise à jour de l'utilisateur :",
            error
          )
          setError("Erreur lors de la mise à jour de l'utilisateur.")
        })
    } else if (isCreating) {
      // Créer un nouvel utilisateur
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/utilisateurs`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then(() => {
          setIsCreating(false)
          fetchUsers()
        })
        .catch((error) => {
          console.error("Erreur lors de la création de l'utilisateur :", error)
          setError("Erreur lors de la création de l'utilisateur.")
        })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setSelectedUser(null)
    setFormData({
      pseudo: "",
      email: "",
      role: "membre",
      // Ajoutez d'autres champs si nécessaire
    })
  }

  if (loading) {
    return <p>Chargement des utilisateurs...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="users-tab">
      <h2>Gestion des utilisateurs</h2>
      <button onClick={handleCreate}>Créer un nouvel utilisateur</button>
      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="user-form">
          <div>
            <label htmlFor="pseudo">Pseudo :</label>
            <input
              type="text"
              id="pseudo"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="role">Rôle :</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="membre">Membre</option>
              <option value="admin">Administrateur</option>
              {/* Ajoutez d'autres rôles si nécessaire */}
            </select>
          </div>
          {/* Ajoutez d'autres champs si nécessaire */}
          <button type="submit">
            {isEditing ? "Mettre à jour l'utilisateur" : "Créer l'utilisateur"}
          </button>
          <button type="button" onClick={handleCancel}>
            Annuler
          </button>
        </form>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pseudo</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.pseudo}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Modifier</button>
                  <button onClick={() => handleDelete(user.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UsersTab
