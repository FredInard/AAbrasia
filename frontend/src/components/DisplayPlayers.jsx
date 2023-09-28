import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"

export default function DisplayPlayers({ postData }) {
  const [allPosts, setAllPosts] = useState([])

  const tokenFromCookie = Cookies.get("authToken")
  const headers = {
    Authorization: `Bearer ${tokenFromCookie}`,
  }

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/utilisateur/displayPlayers/${
          postData.PartieID
        }`,
        { headers }
        // ,{
        //   headers,
        // }
      )
      .then((res) => setAllPosts(res.data))
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la récupération des sujets.",
          error
        )
        // Gérez l'erreur ici (peut-être un message à l'utilisateur)
      })
  }, [postData])

  console.info("postcards2", postData)

  return (
    <div className="displayPlayers-container">
      {allPosts.map((post) => (
        <div className="post-card" key={post.id}>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/${post.profil_picture}`}
            alt="photo de profil de l'utilisateur"
          />
          <div className="post-details">
            <div className="username">{post.Pseudo}</div>
            <div className="content">{post.PhotoProfil}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
