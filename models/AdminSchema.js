import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const AdminSchema = new mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    cpassword: {
        type: String
    },
    roles: {
        type: String,

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

})

AdminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next()
})

AdminSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token;

    } catch (error) {
        console.log(error)
    }

}

const User = mongoose.model("USER", AdminSchema)

export default User;