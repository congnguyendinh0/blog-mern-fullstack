const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    },

    bio:{
        type:String
    },
    follow:[{
        type: mongoose.Schema.Types.ObjectId, ref:'user'
    }]
});

UserSchema.methods.follows = (profile) => {
    let index = this.follow.indexOf(profile._id)
    if (index !== -1) {
        this.follow.push(profile)
    }

    return this.save()
}

UserSchema.methods.unfollows = (profile) => {
    let index = this.follow.indexOf(profile._id)
    if (index !== -1) {
    this.follow.splice(index, 1)
    }
}

module.exports = User = mongoose.model('user', UserSchema);