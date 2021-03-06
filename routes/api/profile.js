const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const user = require('../../models/User');
const {
    check,
    validationResult
} = require('express-validator')
const request = require('request');
const config = require('config');
// add route  get api/profile/me
// description get current user profile
// access private -> auth


router.get('/me', auth, async (req, res) => {
    try {
        console.log('hello');
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user',
            ['name', 'avatar']

        );

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile for this user '
            });
        }
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error');
    }



});


// add route  get api/profile/
// dcreate update profile
// access private -> auth

router.post('/',
    [auth, [
        check('status', 'status is required').not().isEmpty(),
        check('skills', 'skills required').not().isEmpty()
    ]],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin

        } = req.body;

        //Build profile

        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;

        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        };

        // social obj  
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({
                user: req.user.id
            });
            if (profile) {
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                });
                return res.json(profile);
            }
            //create profile
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');

        }

        //console.log(profileFields.social.twitter);
        //res.send('hello');

    });

//@route get api/orofile
//@ des get all profiles
//acces  publi 
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//@route get api/orofile/user/:user_id
//@ des get profile by id
// access public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar'])

        if (!profile) return res.status(400).json({
            msg: 'there is no profile for this user'
        })
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            msg: 'there is no profile for this user'
        }
    }
    res.status(500).send('Server Error');
})


////@route delete api/orofile
//@ des get all profiles
//acces  publi 
router.delete('/', auth, async (req, res) => {
    try {
        //remove profile
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        await User.findOneAndRemove({
            _id: req.user.id
        });
        res.json({
            msg: 'User deleted'
        })


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

////@route put api profile experience
//@ desc  add profile experience
//acces  private

router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Comapany is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    check('to', 'to date is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors) {
        res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        title,
        company,
        from,
        location,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };
    try {

        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (profile) {
            profile.experience.unshift(newExp);
            await profile.save();

            res.json(profile);
        } else {
            return res.status(400).json({
                msg: 'Profile not found..'
            });
        }

    } catch (error) {
        res.status(500).json('Server Error ' + error.message);
    }

});

//@route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1)
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

////@route put api profile experience
//@ desc  add profile experience
//acces  private

router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty(),
    check('to', 'to date is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);
    if (!errors) {
        res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        from,
        to,
        current,
        description
    };
    try {

        let profile = await Profile.findOne({
            user: req.user.id
        });
        if (profile) {
            profile.education.unshift(newEducation);
            await profile.save();

            res.json(profile);
        } else {
            return res.status(400).json({
                msg: 'Profile not found..'
            });
        }

    } catch (error) {
        res.status(500).json('Server Error ' + error.message);
    }

});

//@route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1)
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
          req.params.username
        }/repos?per_page=2&sort=created:asc&client_id=${config.get(
          'githubClientId'
        )}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({
                    msg: 'No Github profile found'
                });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




module.exports = router;