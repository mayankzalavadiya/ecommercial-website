import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () =>{
    try{
      const conn = await mongoose.connect(process.env.MONGO_URL)
      console.log(`connect to mongodb database ${conn.connection.host}`.bgCyan.white)
    }
    catch(err){
     console.log(`error in mongoose ${err}`.bgRed.white)
    }
}

export default connectDB;