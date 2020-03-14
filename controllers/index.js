const User = require('../models/user');

module.exports = {
    async postRegister(req, res, next){
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });
        //console.log('registering user');
      await User.register(newUser, req.body.password)
      
          console.log('user registered!');
          res.redirect('/');
        
    }
}