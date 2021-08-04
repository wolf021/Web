
import multer from 'multer'



const storage = multer.diskStorage({
    //uor destination upload folder
    destination: function (req, res, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        //console.log(file)
        //generate unique name for each image
        cb(null, 'couger' + '-' + Date.now() + path.extname(file.originalname))
    }
})

//file filter we accept any file and we ill do validation later 
const fileFilter = (req, res, cb) => {
    cb(null, true)
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

module.exports = upload.single(file)