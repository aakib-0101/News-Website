const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, default: "Technology" },
    image: { type: String }, 
    description: { type: String }, // Kept for your older articles
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    
    // 👇 NEW: This allows infinite blocks in any order!
    contentBlocks: [{
        blockType: { 
            type: String, 
            enum: ['paragraph', 'image', 'video', 'link'] 
        },
        value: { type: String }
    }]

}, { timestamps: true });

module.exports = mongoose.model('news', newsSchema);