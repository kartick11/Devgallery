const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usershema= new Schema({
    name:{
        type:String,
        required:true      
    },
    email:{
        type:String,
        required:true,
        unique:true        
    },
    password:{
        type:String,
        required:true       
    },
})

const userModel=mongoose.model("users",usershema);

module.exports=userModel;