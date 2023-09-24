const mongoose=require("mongoose");

async function connectToDb(dburl){
    try {
        await mongoose.connect(dburl,{useNewUrlParser:true})
    } catch (error) {
        console.log(error)
    }
}

module.exports=connectToDb;