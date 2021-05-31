const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({

    title: {
        type: String,
        require:true,
        trim: true
    },
    body: {
        type: String,
        require:true
    },
    status: {
        type: String,
        require:true,
        default: 'public',
        enum:['public' , 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    CreateAt: {
        type: Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Story', StorySchema)