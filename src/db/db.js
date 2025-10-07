const mongoose = require("mongoose");

const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.Mongo_URI)
        console.log("db is connected");
        
    } catch (error) {
        console.log("error in db connection",error );
        
    }
}

module.exports = connectDb;