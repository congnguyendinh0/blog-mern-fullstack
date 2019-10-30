const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const user = require('../../models/User');

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config') // muss importiert werden für jwt
const {
    check,
    validationResult
} = require('express-validator'); // express validator

//@route Post api /users
//@desc Register user
//@access Public
router.post('/', [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include an E-Mail').isEmail(),
        check('password', 'Please enter a password  with 6 or more character').isLength({
            min: 6
        })

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
            name,
            email,
            password
        } = req.body;


        try {
            let user = await User.findOne({
                email
            });

            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: 'User already exists'
                    }]
                });
            }
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm' // user icon

            });
            // create the user 
            user = new User({
                name,
                email,
                avatar,
                password
            });

            

            // Encrypt password

            const salt = await bcrypt.genSalt(10); // salt
            user.password = await bcrypt.hash(password, salt);

            await user.save(); // everything what is a promise await save the user
            // get the payload + user id 
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
})

//follow
router.post('/follow/:id', async(req,res,next)=>{
    let authUser = req.body.userid
    let followUser = req.params.id

    await User.findById(authUser).then(async(user) => {
        let profile = await User.findById(followUser).then(profile => {
            return profile
        })

        // chek if  user alread follows
        function isFollowing(user, profile) {
            if (user) {
                if (user.follow.includes(profile._id)) {
                    return true
                } 
                return false
            }
        }

        function addFollow(user, profile) {
            if (user.follow) {
                user.follow.push(profile)
            }
            return user.save()
        }

        if (isFollowing(user, profile)) {
            return res.sendStatus(400)
        } else {
            addFollow(user, profile)
            return res.json(user)
        }
        
    }).catch(next)
})

router.delete('/unfollow/:id', async(req, res, next) => {
    let authUser = req.body.userid
    let followUser = req.params.id
    console.log(req.body)
    await User.findById(authUser).then(async(user) => {
        let profile = await User.findById(followUser).then(profile => {
            return profile
        })
        
        function isFollowing(user, profile) {
            if (user) {
                if (user.follow.includes(profile._id)) {
                    return true
                } 
                return false
            }
        }

        function defollowUser(user, profile) {
            let idx = user.follow.indexOf(profile._id)
            if (idx !== -1) {
                user.follow.splice(idx, 1)
            }
            return user.save()
        }
        
        if (await isFollowing(user, profile)) {
            await defollowUser(user, profile)
            return res.sendStatus(user)
        } else {
            await defollowUser(user, profile)
            return res.json(user)
        }
    }).catch(next)
})

router.get('/user/:id',async (req,res,next)=>{
    await User.findById(req.params.id).select('-password')
                .then(user => {
                    return res.json(user)
                }).catch(next)
})
    

module.exports = router;