import mongoose from 'mongoose'

const img1 = ['profilePic', 'header Image']
const img2 = [
    { profilePic: 'profilePic' },
    { headerImg: 'headerImg' }
]

const postSchema = new mongoose.Schema({

    title: {
        type: String
    },
    make: {
        type: String
    },
    price: {
        type: String

    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    selectedFile: [{
        filePath: {
            type: String,
            default: 'img',
            required: true
        },
        fileName: String,

        fileId: String
    }],
    year: {
        type: String

    },
    millage: {
        type: String

    },
    description: {
        type: String


    }
})

const Post = mongoose.model('POST', postSchema)

export default Post;