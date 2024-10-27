const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const User = require('./model/user');
const Movie = require('./model/movie');

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/movie_DB')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });
     
    
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));




const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    
        console.log('Session created:', req.session);
        res.redirect('/movies');
    
});



app.get('/movies', async (req, res) => {
    const movies = await Movie.find();
    res.render('movies', { movies });
});

app.get('/movies/add', (req, res) => {
    res.render('addMovie');
});

app.post('/movies/add', upload.array('images', 5), async (req, res) => {
    const { name, director, producer, releaseDate, screens } = req.body;
    const images = req.files.map(file => file.path);  // Multiple image paths
    const movie = new Movie({ name, director, producer, releaseDate, images, screens });
    await movie.save();
    res.redirect('/movies');
});

app.post('/movies/delete/:id', async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/movies');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
