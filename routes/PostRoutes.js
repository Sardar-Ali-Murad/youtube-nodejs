import { display } from "@mui/system"
import express from "express"
let router=express.Router()

import {createPost,deletePost,updatePost,postComment,like,dislike,trendingVedios,searchVedios,randomVedios,relatedVedios,getSingleUserPosts,getCurrentUserPosts,getSinglePost} from "../controllers/PostController.js"

router.route("/").post(createPost)
router.route("/delete/:id").delete(deletePost)
router.route("/update/:id").patch(updatePost)
router.route("/singlePost/:id").get(getSinglePost)
router.route("/createComment").post(postComment)
router.route("/likePost/:vedioId").post(like)
router.route("/dislikePost/:vedioId").post(dislike)
router.route("/releatedPosts").get(relatedVedios)
router.route("/trendingPosts").get(trendingVedios)
router.route("/randomPosts").get(randomVedios)
router.route("/searchPosts").get(searchVedios)
router.route("/singleUserPosts/:userId").get(getSingleUserPosts)
router.route("/currentUserPosts").get(getCurrentUserPosts)

export default router