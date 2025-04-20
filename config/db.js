import mongoose from "mongoose";
let cached = global.mongoose
if(!cached){
    cached= global.mongoose ={conn:null , promise:null}
}
async function connection() {
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opts={
            bufferCommands:false
        }
        cached.promise= mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`, opts).then(mongoose=>{ return mongoose})
    }
    cached.conn=await cached.promise
    return cached
    
}
export default connection