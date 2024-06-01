// Ejercicio 3.1, 3.2, 3.3 , 3.4, 3.5, 3.6, 3.7, 3.8
// 3.9

const cors = require('cors')
const express = require('express')
var morgan = require('morgan')

morgan.token('data', (req, res) => JSON.stringify(req.body))

const app = express()

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(cors())

let persons = [
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length} people </br> </br> ${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).send({error: 'not found'}).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name || !person.number) {
        return response.status(400).json({ 
            error: 'Content is missing' 
        })
    }

    if (!persons.find(p => p.name === person.name)){
        let id = Number(Math.floor(Math.random() * 1000000))
        console.log(id)
        // Data?
        person.id = (persons.length > 0) ? person.id = id : 0

        response.json(person)
        persons = persons.concat(person)
    }else{
        return response.status(400).json({ 
        error: 'Name already exits, name must be unique' 
        })
    }
})

app.use((request,response) => {
    response.status(404).json({
        error: "Not found"
    })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})