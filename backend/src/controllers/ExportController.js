const XLSX = require("xlsx")
const models = require("../models") // Adapter selon votre structure de projet

class ExportController {
  static exportAllTables(req, res) {
    // Récupérer les données des différentes tables
    Promise.all([
      models.utilisateur.findAll(), // Récupère les utilisateurs
      models.partie.findAll(), // Récupère les parties
      models.participation.findAll(), // Récupère les participations
      models.repas.findAll(), // Récupère les repas
      models.covoiturage.findAll(), // Récupère les covoiturages
    ])
      .then((results) => {
        const [utilisateurs, parties, participations, repas, covoiturages] =
          results

        // Création du workbook Excel
        const workbook = XLSX.utils.book_new()

        // Création de feuilles pour chaque table
        const utilisateurSheet = XLSX.utils.json_to_sheet(utilisateurs[0])
        const partieSheet = XLSX.utils.json_to_sheet(parties[0])
        const participationSheet = XLSX.utils.json_to_sheet(participations[0])
        const repasSheet = XLSX.utils.json_to_sheet(repas[0])
        const covoiturageSheet = XLSX.utils.json_to_sheet(covoiturages[0])

        // Ajout des feuilles au workbook
        XLSX.utils.book_append_sheet(workbook, utilisateurSheet, "Utilisateurs")
        XLSX.utils.book_append_sheet(workbook, partieSheet, "Parties")
        XLSX.utils.book_append_sheet(
          workbook,
          participationSheet,
          "Participations"
        )
        XLSX.utils.book_append_sheet(workbook, repasSheet, "Repas")
        XLSX.utils.book_append_sheet(workbook, covoiturageSheet, "Covoiturages")

        // Écrire le fichier Excel dans un buffer
        const excelBuffer = XLSX.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        })

        // Définir les en-têtes pour le téléchargement
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=export_all_tables.xlsx"
        )
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        // Envoyer le fichier Excel au client
        res.send(excelBuffer)
      })
      .catch((err) => {
        console.error("Erreur lors de l'export des données :", err)
        res.status(500).send("Erreur lors de l'export des données.")
      })
  }
}

module.exports = ExportController
