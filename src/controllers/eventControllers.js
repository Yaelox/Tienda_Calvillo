const db = require("../models/eventModel");
const Event = db.events;

// Crear un nuevo evento
exports.create = (req, res) => {
  if (!req.body.name || !req.body.date || !req.body.location) {
    return res.status(400).send({
      message: "Faltan datos para crear el evento."
    });
  }

  const event = {
    name: req.body.name,
    date: req.body.date,
    location: req.body.location
  };

  Event.create(event)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Hubo un error al crear el evento."
      });
    });
};

// Obtener todos los eventos
exports.findAll = (req, res) => {
  Event.findAll()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Hubo un error al obtener los eventos."
      });
    });
};

// Obtener un evento por ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Event.findByPk(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `No se encontró el evento con id ${id}` });
      } else {
        res.status(200).send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error al obtener el evento con id ${id}`
      });
    });
};

// Actualizar un evento
exports.update = (req, res) => {
  const id = req.params.id;

  Event.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Evento actualizado exitosamente." });
      } else {
        res.send({ message: `No se pudo actualizar el evento con id ${id}` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error al actualizar el evento con id ${id}`
      });
    });
};

// Eliminar un evento
exports.delete = (req, res) => {
  const id = req.params.id;

  Event.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Evento eliminado exitosamente." });
      } else {
        res.send({ message: `No se pudo eliminar el evento con id ${id}` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error al eliminar el evento con id ${id}`
      });
    });
};
