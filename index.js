// Ejercicio 3.1, 3.2, 3.3 , 3.4, 3.5, 3.6, 3.7, 3.8
// 3.9, 3.10, 3.11, 3.12, 3.13, 3.14, 3.15, 3.16, 3.17, 3.18

require('dotenv').config()
const cors = require('cors')
const express = require('express')
var morgan = require('morgan')
morgan.token('data', (req, res) => JSON.stringify(req.body))
const app = express()
const Person = require('./models/person')
const logerror= require('./modulos/logError')

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(cors())

app.use(express.static('dist'))

// Carga web statica de Dist
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Numero de objetos de MongoDB
app.get('/info', (request, response, next) => {
    Person.countDocuments({})
    .then( per => {response.send(`<p> Phonebook has info ${per} for people </br> </br> ${new Date()}</p>`)})
    .catch(error => next(error))
})

//Muestra todas las entradas
app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(per => {response.json(per)})
    .catch(error => next(error))
})

//Muestra informacion de una persona
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(per =>{ 
        if (per){response.json(per)}
        else {response.status(404).send({error: 'Error Not Found'}).end()}
    })
    .catch(error => next(error))
})

//Borra una persona
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

// Inserta datos MongoDB
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({error: 'Content is missing'})
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => {response.json(savedPerson)})
    .catch(error =>{response.status(500).send({error: 'Server Error'}).end()})
})

//Actualiza entrada
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const persona = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, persona, {new: true})
    .then(update => {response.json(update)})
    .catch(error => next(error))
})

// controlador de solicitudes con endpoint desconocido
app.use(logerror.unknownEndpoint)

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(logerror.errorHandler)

//variable entorno PORT .env
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})