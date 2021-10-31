const {model, Schema} = require('mongoose')
var schema = new Schema({
      
email:{
    type:String,
    parse:true
},
clientName:{
    type:String,
    parse:true
}})

module.exports= model('client',schema) ;
