import multer from "multer"
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user.id

        const folder = file.fieldname === "resume" ? "resume" : "jd"

        const destination = path.join(
            "uploads",
            userId,
            folder
        )
        fs.mkdirSync(destination, { recursive: true})
        cb(null, destination)
    },

    filename: function (req, file, cb) {
        // const uniqueSuffix = + '-' + Math.round(Math.random() * 1E9)
        cb(null, Date.now() + file.originalname)
    },   
})

export const uploadDocument = multer({
    storage,
    limits: {  
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Only PDF and DOCX documents are supported');
            error.statusCode = 400;
            return cb(error);
        }
        cb(null, true);
    }
})