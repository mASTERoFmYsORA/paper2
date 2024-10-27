const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    director: { type: String, required: true },
    producer: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    images: [{ type: String }],  // Array to store multiple image paths
    screens: [{ type: String }]  // To store selected screens
});

 var movie = mongoose.model('Movie', movieSchema);
 module.exports =movie;