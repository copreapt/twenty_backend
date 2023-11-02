require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();
// rest of the packages
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');

// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes')

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require ('./middleware/error-handler.js');


app.use(express.json());
app.use(fileUpload());

app.use('/api/v1/auth', authRouter);





app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();