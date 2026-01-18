import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const connectToDb= async()=>{
    try{
        console.log(process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI)
    }catch(e){
        console.log(e)
    }
}