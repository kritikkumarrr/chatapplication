const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
    
},{strict:false});

const message = mongoose.model('message', MessageSchema, 'message');
module.exports = message;

