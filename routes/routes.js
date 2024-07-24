const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './uploads');
    },
    filename: function(req, file, callback){
        callback(null, file.fieldname+"_"+Date.now()+'_'+file.originalname);
    }
});

var upload  = multer({
    storage: storage
}).single('image'); 

router.get('/', (req, res)=>{
    // res.send('Users Page');
    res.render('index',{title: 'Home Page', message : req.session.message});
    delete req.session.message;
});


//insert an use rin databse
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });
        await user.save();
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        console.log(req.session.message);
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});
router.get('/add', (req,res)=>{
    res.render('add_users', {title: 'Add Users'})
})

module.exports = router;