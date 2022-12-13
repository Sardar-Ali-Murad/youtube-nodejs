import Auth from "../models/Auth.js"
import {BadRequestError,UnAuthenticatedError,NotFoundError} from "../errors/index.js"
import {REQUESTED_RANGE_NOT_SATISFIABLE, StatusCodes} from "http-status-codes"
import PostModel from "../models/PostModel.js"
import { ConstructionOutlined } from "@mui/icons-material"

let Register=async (req,res)=>{
    let {name,password,email,image}=req.body

    if(!name || !password || !email){
        throw new BadRequestError("Please Provide All Credentials")
    }

    let emailAlreadyExists=await Auth.findOne({email})
    if(emailAlreadyExists){
        throw new BadRequestError("Email Already Exists")
    }

    let user=await Auth.create({name,password,email,image})

    let token =user.createJWT()

    res.status(StatusCodes.CREATED).json({
        user:{name,email,image},
        token:token
    })
}



let Login=async (req,res)=>{
    let {password,email}=req.body
    
    if(!password || !email){
        throw new BadRequestError("Please Provide All Credentials")
    }
    
    let user=await Auth.findOne({email})
    if(!user){
        throw new BadRequestError("User Does Not Exists")
    }

    let isPasswordCorrect=await user.comparePassword(password)
    
    if(!isPasswordCorrect){
        throw new BadRequestError('Password is not correct')
    }
   
    
    let token =user.createJWT()
    
    res.status(StatusCodes.CREATED).json({
        user:{name:user.name,email,image:user.image},
        token:token

    })
    
}


const saveVedio=async (req,res)=>{
    let {vedioId}=req.params

    if(!vedioId){
        throw new BadRequestError("Provide the id")
    }

    let currentUser=await Auth.findOne({_id:req.user.userId})

    let vedio=await PostModel.findOne({_id:vedioId})

    if(!vedio){
        throw new BadRequestError("The Vedio Does Not Exists")
    }

    let AlreadyExists=currentUser.savedVedios.includes(vedioId)
    
    if(AlreadyExists){
        throw new BadRequestError("The Vedios Is Already Saved")
    }
    
    
    
    let updatedUser=await Auth.findOneAndUpdate({_id:req.user.userId},{$push:{savedVedios:vedioId}})

    res.status(200).json({updatedUser})

}


const addSubscription=async (req,res)=>{
    let {userId}=req.params
    if(!userId){
        throw new BadRequestError('Please Provide the user Id To Proceed')
    }
    // let AlreadyExists=await Auth.findOne({_id:req.user.userId},{$in:{suscription:userId}})
    
    let currentUser=await Auth.findOne({_id:req.user.userId})

    if(currentUser.suscription.includes(userId)){
        throw new BadRequestError("You already have suscribed this channel")
    }



    let addSubscribe=await Auth.findOneAndUpdate({_id:req.user.userId},{$push:{suscription:userId}})
     
//   let user=await Auth.findOne({_id:userId})

  let updateUser=await Auth.findOneAndUpdate({_id:userId},{$push:{yourSuscribers:req.user.userId}})

  res.status(StatusCodes.OK).json({updateUser,addSubscribe})
    
}

const getCurrentUser=async (req,res)=>{
    let user=await Auth.findOne({_id:req.user.userId}).populate("savedVedios")

    //     let allSuscribedVedios=[];
    //     user.suscription.map((userId)=>{
    //         let data=PostModel.find({user:userId})
    //         allSuscribedVedios=[...allSuscribedVedios,data]
    // })
    const SuscriptionPosts = await Promise.all(
        user.suscription.map((suscriptionId) => {
          return PostModel.find({ user: suscriptionId });
        })
      );

    res.status(200).json({user,SuscriptionPosts})
}

const getSingleUser=async (req,res)=>{
    let {userId}=req.params
    let user=await Auth.findOne({_id:userId}).select("-password")
    res.status(StatusCodes.OK).json({user})

}










export {Register,Login,saveVedio,getCurrentUser,addSubscription,getSingleUser}