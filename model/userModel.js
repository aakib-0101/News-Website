const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        min: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    // 👇 NEW: Super Admin role flag
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'news'
    }]
    
}, {
    timestamps: true
});

let Users = mongoose.model("users", userSchema);
module.exports = Users;