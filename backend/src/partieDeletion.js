const mysql = require("mysql2")

const deletePartie = (id) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  // Début de la transaction
  connection.beginTransaction(function (err) {
    if (err) {
      throw err
    }

    // Suppression des entrées dans la table "participation" qui font référence à la partie
    connection.query(
      "DELETE FROM participation WHERE Partie_Id = ?",
      [id],
      function (err, results) {
        if (err) {
          // En cas d'erreur, annuler la transaction
          return connection.rollback(function () {
            throw err
          })
        }

        // Suppression de la ligne dans la table "partie"
        connection.query(
          "DELETE FROM partie WHERE id = ?",
          [id],
          function (err, results) {
            if (err) {
              // En cas d'erreur, annuler la transaction
              return connection.rollback(function () {
                throw err
              })
            }

            // Commit de la transaction si tout s'est bien passé
            connection.commit(function (err) {
              if (err) {
                return connection.rollback(function () {
                  throw err
                })
              }

              console.info(
                "La partie et les participations associées ont été supprimées avec succès."
              )
            })
          }
        )
      }
    )
  })
}

module.exports = {
  deletePartie,
}
