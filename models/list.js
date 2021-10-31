const {model, Schema} = require('mongoose')
var schema = new Schema({
   
clientName:{
    type:String,
    parse:true
},
address:{
    type:String,
    parse:true
},
lat:{
    type:"number",
    parse:true
},
lng:{
    type:"number",
    parse:true
},
});

module.exports= model('kargolist',schema) ;