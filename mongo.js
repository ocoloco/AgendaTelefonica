// 3.12

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ocoloco:${password}@osocluster1.g0zzajc.mongodb.net/PersonApp?retryWrites=true&w=majority&appName=OsoCluster1`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const aname = process.argv[3]
const anumber = process.argv[4]

if (aname === undefined){
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, '-', person.number)
    })
    mongoose.connection.close()
  })
}else{
  const person = new Person({
    name: aname,
    number: anumber,
  })
    person.save().then(console.log('added',aname, 'number:',anumber, 'to phonebook'))
    mongoose.connection.close()
  }
