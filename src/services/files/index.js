import express from "express";
import multer from "multer";
import createError from "http-errors";
import { writeAuthorImage } from "../../lib/fs-tools.js";
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"

const filesRouter = express.Router();

// 1. SINGLE UPLOAD

filesRouter.post(
  "/upload",
  multer({
    fileFilter: (req, file, multerNext) => {
      if (file.mimetype !== "image/gif") {
        return multerNext(createError(400, "Only GIF allowed!"));
      } else {
        return multerNext(null, true);
      }
    },
  }).single("avatar"),
  async (req, res, next) => {
    try {
      console.log(req.file);

      await writeAuthorImage(req.file.originalname, req.file.buffer);
      res.send("Image uploaded!");
    } catch (error) {
      next(error);
    }
  }
);

// 2. MULTIPLE UPLOAD

filesRouter.post(
  "/uploadMultiple",
  multer().array("avatar", 2),
  async (req, res, next) => {
    try {
      console.log("REQ. FILE: ", req.file);
      console.log("REQ. FILES: ", req.files);

      const arrayOfPromises = req.files.map((file) =>
        writeAuthorImage(file.originalname, file.buffer)
      );

      await Promise.all(arrayOfPromises);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

const cloudStorage= new CloudinaryStorage({
  cloudinary,
  params:{
    folder: "aizada-strive"
  }
})

filesRouter.post("/uploadCloudinary", multer({ storage: cloudStorage }).single("profilePic"), async (req, res, next) => {
  try {
    console.log(req.file)
    res.send("Image uploaded on Cloudinary!")
  } catch (error) {
    next(error)
  }
})

// filesRouter.get("/downloadPDF", (req, res, next) => {
//   try {
//     res.setHeader("Content-Disposition", "attachment; filename=whatever.pdf") // This header tells the browser to open the "Save file on disk" dialog
//     const source = getPDFReadableStream({ firstName: "Bogdan", lastName: "Birau" })
//     const destination = res
//     pipeline(source, destination, err => {
//       if (err) next(err)
//     })
//   } catch (error) {
//     next(error)
//   }
// })

export default filesRouter;
