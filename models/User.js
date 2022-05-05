var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: { type:String, required:true, unique:true },
    pass: { type:String, required:true },
    name: { type:String, required:false, default:'' },
    zones: [{
        markers: [{ 
            latitude: { type:Number, required:true },
            longitude: { type:Number, required:true },
         }],
        allowed: {
            id: { type:String, required:true }, 
        }
    }],
    friends: [{
        id: { type:String, required:true },
        user: { type:String, required:true },
    }],
});

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;