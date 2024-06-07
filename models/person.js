const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const valido = (n) => {

}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number:{
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        //Raro telefono 2,3 digitos, "-" y luego 7 u 8 digitos
        let res = v.match(/\d{2,3}-\d{7,8}/)
        if (res!==null) //chequeo de "-"
          return res[0].length == v.length
        else return false
      },
      message: props => `${props.value} is not a valid phone number! example 11-1234567`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)