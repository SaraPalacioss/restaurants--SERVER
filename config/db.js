const mongoose  = require('mongoose');

const connectDB = async () => {
    try {
        await 
        mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        mongoose.set('useCreateIndex', true);
        ;
        console.log('DB Connected');
    } catch (error) {
        console.log('There was an error with conexion')
        console.log(error);
        process.exit(1); 
    };
};

module.exports = connectDB;