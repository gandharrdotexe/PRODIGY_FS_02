const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');

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

router.get('/', (req,res)=>{
  res.render('admin_login', {title: 'Admin Login'})
});

router.post('/checkLogin', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials
  const validUsername = 'admin123';
  const validPassword = 'password';

  // Check credentials
  if (username === validUsername && password === validPassword) {
      // Redirect to /index if credentials are correct
      res.redirect('/index');
  } else {
      // Send a response indicating invalid credentials
      res.status(401).send('Invalid username or password');
  }
});

router.get('/index', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', { title: 'Home Page', users: users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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
        res.redirect('/index');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


router.get('/add', (req,res)=>{
    res.render('add_users', {title: 'Add Users'})
});



router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            res.redirect('/index');
        } else {
            res.render('edit_users', { title: 'Edit User Info', user });
        }
    } catch (err) {
        res.redirect('/index');
    }
});

router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';
  
    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync('./uploads/' + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }
  
    try {
      const result = await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
      }, { new: true });
  
      req.session.message = {
        message: 'User Updated Successfully',
        type: 'success',
      };
      res.redirect('/index');
    } catch (err) {
      res.json({ message: err.message, type: 'danger' });
    }
  });

  // Route to delete a user by ID
// router.get('/delete/:id', async (req, res) => {
//     try {
//       const id = req.params.id;
//       const user = await User.findByIdAndDelete(id);
      
//       if (user) {
//         res.json({
//           message: 'User deleted successfully',
//           type: 'success',
//         });
//         res.redirect('/');
//       } else {
//         res.status(404).json({
//           message: 'User not found',
//           type: 'danger',
//         });
//       }
//     } catch (err) {
//       res.status(500).json({
//         message: err.message,
//         type: 'danger',
//       });
//     }
    
//   });

// Route to delete a user by ID
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const user = await User.findByIdAndDelete(id);
  
      if (user && user.image) {
        try {
          fs.unlinkSync('./uploads/' + user.image);
        } catch (err) {
          console.error('Failed to delete image file:', err);
        }
      }
  
      if (user) {
        req.session.message = {
          message: 'User Deleted successfully',
          type: 'info',
        };
      } else {
        req.session.message = {
          message: 'User not found',
          type: 'danger',
        };
      }
  
      res.redirect('/index');
    } catch (err) {
      console.error('Error deleting user:', err);
      res.json({ message: err.message, type: 'danger' });
    }
  });

module.exports = router;