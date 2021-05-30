const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    })

    console.log(`MonoBD Connected : ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = connectDB;
