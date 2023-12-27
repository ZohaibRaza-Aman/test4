import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((conn) => {
            console.log(`Server Connected to ${conn.connection.host}`.cyan.bold);
        })
        .catch((error) => {
            console.error(`Server Not Connected. Error: ${error.message}`.red.underline.bold);
        });
};

export default connectDB;
