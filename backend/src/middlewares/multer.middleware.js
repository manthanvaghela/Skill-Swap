import multer from "multer";


// we cant send files(imd,doc etc) without multer
const Storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, "./public/temp")
    },
    filename : function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null , file.fieldname + '-' + uniqueSuffix)

        // cb(null, file.originalname)
    }
})


export const upload = multer({ 
    storage : Storage 
})