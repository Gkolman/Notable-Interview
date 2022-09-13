const mongoose = require('mongoose');
require('dotenv').config();

const pass = process.env.MONGO_PASSWORD || 'no username'
const user = process.env.MONGO_USERNAME || 'no password'
const MONGO_ATLAS = `mongodb+srv://${user}:${pass}@cluster0.uvx8gel.mongodb.net/test`
mongoose.connect(MONGO_ATLAS, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {console.log('mongo db connected')})
.catch((err) => {console.log('mongo failed to connect ', err)})

const newSchema = new mongoose.Schema({
    name: String,
    birthYear: Number,
});

const Document = mongoose.model('table', newSchema);


let createRecord = async (data) => {
  let newDocument = new Document(data)
  newDocument.save((error) => {
    if (error) { console.log('error', error)}
  })
}
let getRecord = (query) => {
    return Document.find(query)
}

let deleteRecord = (id) => {
    
    return Document.find({id: id})
    
}
let updateRecord = (id, updates) => {
    
    return Document.find({id: id})
}
// createRecord({name: 'Nicole', birthYear: 1995})
// getRecord({$or: [{name: 'Becca'},{birthYear: 1996}]})
// .then((data) => {
//     console.log('data ->', data)
// })
 module.exports = {
    Document : Document
  }


