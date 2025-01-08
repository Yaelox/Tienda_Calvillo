module.exports = app => {
    const events = require("../controllers/event.controller.js");
  
    let router = require("express").Router();
  
    // Crear un nuevo evento
    router.post("/event", events.create);
  
    // Obtener todos los eventos
    router.get("/", events.findAll);
  
    // Obtener un evento por ID
    router.get("/:id", events.findOne);
  
    // Actualizar un evento
    router.put("/:id", events.update);
  
    // Eliminar un evento
    router.delete("/:id", events.delete);
  
    app.use("/events", router);
  };
  