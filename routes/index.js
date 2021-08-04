import express from 'express'
import bcrypt from 'bcryptjs'
import Post from '../models/PostsSchema.js'
import User from '../models/AdminSchema.js'
import Authenticate from '../middlewares/Authentication.js'
import multer from 'multer'
import path from 'path'


import cloudinary from 'cloudinary'


//Cloudinary Config 

cloudinary.config({
    cloud_name: 'wolf1e',
    api_key: '427566787945736',
    api_secret: 'ocdqwdDmwxIXEbiVVtOFQ7ZNCrc'
});




//multer for temporay temp images from client



const storage = multer.diskStorage({
    //uor destination upload folder

})

//file filter we accept any file and we ill do validation later 
const fileFilter = (req, res, cb) => {
    cb(null, true)
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})


const router = express.Router()

//Admin Delete

router.delete('/admin/:id', async (req, res) => {
    try {
        const deleted = await User.remove({ _id: req.params.id })
        console.log(deleted)
        res.json({ message: "User deleted", deleted })



    } catch (error) {
        console.log(error)

    }
})

// Get All Admin
router.get('/admin/Users', async (req, res) => {
    try {
        const users = await User.find()

        console.log(users)
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json(error)
    }

})



//new Admin Route

router.post('/admin/creation', async (req, res) => {
    const { name, email, password, cpassword, roles } = req.body

    try {
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            res.status(421).json({ message: "userExists" })

        } else if (password != cpassword) {
            res.status(422).json({ message: "password does not match" })

        } else {
            const user = new User({
                name, email, password, cpassword, roles
            })
            await user.save()

            res.status(201).json({ message: 'succesfully registred' })

        }
    } catch (error) {
        console.log(error)

    }
})

//Login page Route

router.post('/admin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "fields required" })
        }
        const userLogin = await User.findOne({ email: email })

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            if (isMatch) {
                token = await userLogin.generateAuthToken();
                res.cookie("token", token, {
                    maxAge: 90000000, httpOnly: true
                })
                console.log(token)
            }

            if (!isMatch) {
                res.status(404).json({ error: "invalid user" })
            } else {
                res.json({ message: 'user SignedIn Successfully' })
            }
        } else {
            res.status(401).json({ message: "invalid cardentials" })
        }

    } catch (error) {
        console.log(error)

    }
})

//new Product Form for Admin 

router.post('/admin/post', Authenticate, upload.array('ImageFile'), async (req, res, next) => {


    const { title, make, price, year, millage, description } = req.body
    //console.log(selectedFile)

    try {
        let imageFile = req.files;
        console.log(imageFile)

        const fileArray = []
        for (const elements of req.files) {
            const result = await cloudinary.v2.uploader.upload(elements.path)
            console.log(result)
            const newfile = {
                fileName: result.original_filename,
                filePath: result.url,
                fileId: result.public_id

            }

            fileArray.push(newfile)
        }
        const newPost = await new Post({ title, make, price, year, millage, description, selectedFile: fileArray })
        await newPost.save()
        res.sendStatus(201)
        console.log("item created")



    } catch (error) {

        res.status(409).json({ message: error })
        console.log(error)

    }
})

//Admin products Management Route

router.get('/posts', Authenticate, async (req, res) => {
    try {
        const posts = await Post.find()

        console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json(error)
    }

})

// Client Products Route
router.get('/Gallaryposts', async (req, res) => {
    try {
        const posts = await Post.find()

        console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json(error)
    }

})

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find()

        console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json(error)
    }

})

//Product Details Route

router.get("/posts/:id", async (req, res, next) => {

    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
        console.log(post)

    } catch (error) {
        console.log(error)

    }
})

//Product Deletion Route

router.delete('/posts/:id', async (req, res, next) => {

    try {
        const deleted = await Post.remove({ _id: req.params.id })
        console.log(deleted)
        res.json({ message: "deleted", deleted })



    } catch (error) {
        console.log(error)

    }
})
// PRoduct Update Route
router.put('/posts/:id', async (req, res, next) => {
    console.log(req.params.id)
    const { title, make, price, year, millage, description, selectedFile } = req.body
    try {
        const Updated = await Post.findByIdAndUpdate({ _id: req.params.id }, {
            $set: {

                title, make, price, year, millage, description, selectedFile
            }
        })
        res.json(Updated)

    } catch (error) {
        console.log(error)
    }
})


export default router;