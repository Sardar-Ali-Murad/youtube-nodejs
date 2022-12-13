
// import {BadRequestError,UnAuthenticatedError,NotFoundError} from "../error/index.js"
import cloudinary from "cloudinary"
import {StatusCodes} from "http-status-codes"
import fs from "fs"

let uploadImage=async (req,res)=>{

    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: 'file-upload',
        }
      );
      fs.unlinkSync(req.files.image.tempFilePath);
      return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });

}

export default uploadImage