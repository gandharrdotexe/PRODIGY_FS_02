//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the views directory
// app.set('views', path.join(__dirname, 'views'));


//database connection
// mongoose.connect(process.env.DB_URI, {useNewParser: true})
// const db = mongoose.connection;
// db.on('error', (err)=>{
//     console.log(err);
// });

// db.once('open', ()=>{
//     console.log('Connected sucessfully to the db');
// });

// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));
//Connection to DB usong mongoose
mongoose.connect(process.env.DB_URI)
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

// app.get('/', (req, res)=>{
//     res.send('Hello');
// });

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(
    session({
        secret: 'gandharsecretekey',
        saveUninitialized: true,
        resave: false
    })
);

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//Routes
app.use('', require('./routes/routes'));



app.listen(PORT, (req, res)=>{
    console.log(`Server started at http://localhost:${PORT}`);
});


