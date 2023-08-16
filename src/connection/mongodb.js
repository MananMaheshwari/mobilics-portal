import mongoose from 'mongoose'

const DB=process.env.mongo_url;

const connectDB=async()=>{
    try{
        await mongoose.connect(DB);
        console.log("Database Connected");
    }catch(err){
        console.log(err);
    }
}

export default connectDB 