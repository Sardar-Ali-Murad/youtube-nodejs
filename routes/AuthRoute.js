import express from "express"
let router=express.Router()

import {Login,Register,saveVedio,getCurrentUser,addSubscription,getSingleUser} from "../controllers/Users.js"
import UploadImage from "../controllers/UploadImage.js"
import Authorization from "../middleware/auth.js"


router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/registerUploadImage").post(UploadImage)
router.route("/saveVedio/:vedioId").post(Authorization,saveVedio)
router.route("/currentUser").get(Authorization,getCurrentUser)
router.route("/singleUser/:userId").get(Authorization,getSingleUser)
router.route("/addSuscription/:userId").post(Authorization,addSubscription)



export default router