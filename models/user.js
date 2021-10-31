const {model, Schema} = require('mongoose')
var schema = new Schema({
    email:{
        type:String,
        parse:true
    },
name:{
    type:String,
    parse:true
},
pass:{
    type:String,
    parse:true
}
});

module.exports= model('user',schema) ;