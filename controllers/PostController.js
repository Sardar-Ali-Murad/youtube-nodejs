import Auth from "../models/Auth.js";
import PostModel from "../models/PostModel.js";
import {BadRequestError,NotFoundError,UnAuthenticatedError} from "../errors/index.js"
import {StatusCodes} from "http-status-codes"
import { PersonRemove } from "@mui/icons-material";


const createPost=async (req,res)=>{
    req.body.user=req.user.userId
    let post=await PostModel.create({...req.body})
    res.status(StatusCodes.CREATED).json({post})
}

const deletePost=async (req,res)=>{
    let {id}=req.params
    let post=await PostModel.findOne({_id:id})

    if(post.user!=req.user.userId){
        throw new UnAuthenticatedError("You Are Not Authorized To Do This Action")
    }

    await post.remove()

    res.status(StatusCodes.OK).json({msg:"The Post Is Deleted Successfullly"})
}


const updatePost=async (req,res)=>{
    let {title,description,mainImg,thumbnailImg,vedio}=req.body

    if(!title || !description || !mainImg || !thumbnailImg || !vedio){
        throw new BadRequestError("Please Provide All the Values")
    }

    let {id}=req.params
    let post=await PostModel.findOne({_id:id})

    if(post.user!=req.user.userId){
        throw new UnAuthenticatedError("You Are Not Authorized To Do This Action")
    }

    post.title=title
    post.description=description
    post.mainImg=mainImg
    post.thumbnailImg=thumbnailImg
    post.vedio=vedio

    await post.save()
    res.status(StatusCodes.OK).json({post})
}


let postComment=async (req,res)=>{
    let {title,vedioId}=req.body

    if(!title || !vedioId){
        throw new BadRequestError("Please Provide the title or the vedioId")
    }

    let updatedPost=await PostModel.findOneAndUpdate({_id:vedioId},{$push:{comments:{title:title,user:req.user.userId}}})

    res.status(StatusCodes.OK).json({updatePost})
}


const getSinglePost=async (req,res)=>{
    let {id}=req.params
    // let vedio=await PostModel.findOne({_id:id}).populate({path:"like",select:"name email"},{path:"dislike",select:"name email"},{path:"user",select:"-password"})
    // let vedio=await PostModel.findOne({_id:id}).populate("like dislike user")
    let vedio=await PostModel.findOne({_id:id}).populate({path:"like",select:"name"}).populate({path:"dislike",select:"name"}).populate({path:"user",select:"-password -savedVedios -suscription" }).populate({path:"comments.user",select:"name"})

    res.status(StatusCodes.OK).json({vedio})
}


const like=async (req,res)=>{
    let {vedioId}=req.params

//   let AlreadyExists=await PostModel.findOne({_id:vedioId},{likes:{$in:req.user.userId}})
    let vedio=await PostModel.findOne({_id:vedioId})
    let AlreadyExists=vedio.like.includes(req.user.userId)

   let updatedPost;

   if(AlreadyExists){
    updatePost =await PostModel.findOneAndUpdate({_id:vedioId},{$pull:{like:req.user.userId}})
   }

   else{
        updatedPost=await PostModel.findOneAndUpdate({_id:vedioId},{$push:{like:req.user.userId}})
   }

   res.status(StatusCodes.OK).json({updatedPost})

}


const dislike=async (req,res)=>{
    let {vedioId}=req.params

    let vedio=await PostModel.findOne({_id:vedioId})
    let AlreadyExists=vedio.dislike.includes(req.user.userId)

   let updatedPost;

  if(AlreadyExists){
    updatePost =await PostModel.updateOne({_id:vedioId},{$pull:{dislike:req.user.userId}})
   }

   else{
        updatedPost=await PostModel.updateOne({_id:vedioId},{$push:{dislike:req.user.userId}})
   }

   res.status(StatusCodes.OK).json({msg:"EveryThing is Ok"})

}

const relatedVedios=async (req,res)=>{
    let {title}=req.body
    if(!title){
        throw new BadRequestError("Provide the title to get releated stuff")
    }
   let Posts=await PostModel.find({ title : { $regex: title, $options: 'i' } }).populate({path:"user",select:"name"})

  res.status(StatusCodes.OK).json({Posts})
}


// No Way to addview as it users the other stuff so we are using the random views
// const createView=async (req,res)=>{
// }



let trendingVedios=async (req,res)=>{
    // let vedios=await PostModel.find().sort({'views.lenght':-1}).limit(10)
    let vedios=await PostModel.find().sort({views:-1}).limit(10).populate({path:"user",select:"name"})
    res.status(StatusCodes.OK).json({vedios})
}


let randomVedios=async (req,res)=>{
    let vedios=await PostModel.aggregate([
        {$sample:{size:10}}
    ])

    await Auth.populate(vedios,{path:"user",select:"name"})

    res.status(StatusCodes.OK).json({vedios})
}


const searchVedios=async (req,res)=>{
    let {title}=req.body
    if(!title){
        throw new BadRequestError("Provide the title to get releated stuff")
    }

  let Posts= await  PostModel.find({ title : { $regex: title, $options: 'i' } })

  res.status(StatusCodes.OK).json({Posts})

}

const getSingleUserPosts=async (req,res)=>{
    let {userId}=req.params
    let allPosts=await PostModel.find({user:userId})
   res.status(StatusCodes.OK).json({allPosts})
}

const getCurrentUserPosts=async (req,res)=>{
    let posts=await PostModel.find({user:req.user.userId})
    res.status(StatusCodes.OK).json({posts})
}




export {createPost,deletePost,updatePost,postComment,like,dislike,trendingVedios,searchVedios,randomVedios,relatedVedios,getSinglePost,getSingleUserPosts,getCurrentUserPosts}