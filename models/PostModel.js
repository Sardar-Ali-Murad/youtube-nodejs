import mongoose from "mongoose"
let PostSchema=new mongoose.Schema({
    mainImg:{
        type:String,
        required:[true,"Please Provide the main image"]
    },
    thumbnailImg:{
        type:String,
        required:[true,"Please Provide the main thumbnail image"]
    },
    title:{
        type:String,
        required:[true,"Please Provide the title of your post"]
    },
    description:{
        type:String,
        required:[true,"Please Provide the description of your post"]
    },
    tags:{
       type:Array,
       default:[]
    },
    vedio:{
        type:String,
        required:[true,"Provide the vedio to post"]
    },

    views:{
        type:Number,
        default:0
    },

     comments:[{title:{type:String,required:[true,"Provide the comment to proceed"]},user:{ type:mongoose.Types.ObjectId,
        ref:"YoutubeAppUsers"}}],

     like:[{type:mongoose.Types.ObjectId,ref:"YoutubeAppUsers"}],

     dislike:[{type:mongoose.Types.ObjectId,ref:"YoutubeAppUsers"}],

     user:{
        type:mongoose.Types.ObjectId,
        ref:"YoutubeAppUsers"
     }
},{timestamps:true})

export default mongoose.model("YoutubeAppPosts",PostSchema)