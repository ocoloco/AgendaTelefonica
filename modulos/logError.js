const { modelName } = require("../models/person")

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted id' })
    } 

    next(error)
}

//Errores 404
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}

module.exports = {errorHandler, unknownEndpoint}