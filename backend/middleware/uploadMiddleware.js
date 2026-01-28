import multer from "multer"
import path from "path"


const __dirname = path.resolve()

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, path.join(__dirname, "backend/uploads/"))
    },
    filename(req, file, cb){
        cb(
            null,
            `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
        )
    }
})


function checkFileType(file, cb){
    const fileTypes = /jpeg|jpeg|png/
    const extname = filetypes.test(
        path.extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        )
    )

    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype){
        cb(null, true)
    } else {
        cb("Images only!")
    }
}


const upload = multer({
    storage, 
    fileFilter: function (req, file, cb){
        checkFileType(file, cb)
    }
})

export default upload