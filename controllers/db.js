const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect(process.env.DB_URI || 'mongodb+srv://vannhon:1@cluster0.vbgiu.mongodb.net/shoppe?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    console.log('connect thanh cong');
}

module.exports = connectDb;