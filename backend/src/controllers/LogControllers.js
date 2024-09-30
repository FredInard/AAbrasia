// controllers/LogControllers.js

const models = require("../models")

class LogControllers {
  // GET /logs
  static browse(req, res) {
    models.log
      .findAll()
      .then(([rows]) => {
        res.status(200).json(rows)
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // GET /logs/:id
  static read(req, res) {
    const id = parseInt(req.params.id, 10)

    models.log
      .find(id)
      .then(([rows]) => {
        if (rows[0]) {
          res.status(200).json(rows[0])
        } else {
          res.sendStatus(404)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // POST /logs
  static add(req, res) {
    const log = req.body

    // TODO: Validations (length, format...)

    models.log
      .insert(log)
      .then(([result]) => {
        res.status(201).json({ id: result.insertId, ...log })
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }

  // DELETE /logs/:id
  static destroy(req, res) {
    const id = parseInt(req.params.id, 10)

    models.log
      .delete(id)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404)
        } else {
          res.sendStatus(204)
        }
      })
      .catch((err) => {
        console.error(err)
        res.sendStatus(500)
      })
  }
}

module.exports = LogControllers
