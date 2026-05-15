const express = require("express");
const router = express.Router();
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "screenshots/");
    },

    filename: (req, file, cb) => {
        cb(null, `chart-${Date.now()}.png`);
    },
});

const upload = multer({ storage });

router.post("/upload-screenshot", upload.single("screenshot"), async (req, res) => {
    try {
        console.log("✅ Saved Successfully!!", req.file.filename);

        res.status(200).json({
            success: true,
            file: req.file.filename,
            message: "✅ ScreenShot Saved Successfully!!"
        });
    }
    catch (err)
    {
        res.status(500).json({
            success: false,
            message: "Some Error Occured",
            error: err
        });
    }
});

export default router;