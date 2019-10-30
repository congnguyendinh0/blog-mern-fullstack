const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); // import middleware
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const config = require('config') // muss importiert werden für jwt
const {
    check,
    validationResult
} = require('express-validator'); // express validator
const jwt = require('jsonwebtoken');

// add route  get api/auth
// description auth route 
// access public 
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // ohne passwort
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }

});

//@route Post api /users
//@desc Register user
//@access Public
router.post('/', [
        check('email', 'Please include an E-Mail').isEmail(),
        check('password', 'Password is required').exists()

    ],

    async (req, res) => {
        //console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) { // if user already exists
            return res.status(400).json({
                errors: errors.array()
            }) // bad request
        }


        // See if user exists
        // gravatar 

        //encrypt  password
        //return webtoken


        const {
            email,
            password
        } = req.body;


        try {
            let user = await User.findOne({
                email
            });

            if (!user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid credentials'
                    }]
                });
            }

            //password check

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{
                        msg: 'Invalid credentials'
                    }]
                });
            }




            const payload = {
                user: {
                    id: user.id
                }
            }
            // sign the token
            jwt.sign(
                payload,
                config.get('jwtToken'), {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    })
                }
            );

            //res.send('user registered ');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }




    });





// copied from user
// post api/auth
//desc Authenticate user & get token
// acces public

router.put('/settings',auth,async (req,res)=>{
    

       try {const user = await User.findById(req.user.id)
        const {name,email,password,bio,avatar}=req.body
        user.name = name
        user.email=email
        user.bio=bio
        user.avatar=avatar
        const salt = await bcrypt.genSalt(10); // salt
            user.password = await bcrypt.hash(password, salt);
           await user.save()
           return res.json(user)
           
       } catch (error) {
           console.log(error)
           return res.json(error)
       }

})


module.exports = router;