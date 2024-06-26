require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();
// rest of the packages
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const fileUpload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
app.use(express.static("./public"));

// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const likesRouter = require('./routes/likesRoutes');
const commentsRouter = require('./routes/commentsRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require ('./middleware/error-handler.js');

app.set("trust proxy", 1);
app.use(helmet());
// app.use(
//   cors({
//     origin: "https://twenty-media.netlify.app",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: true, //included origin as true
    credentials: true, //included credentials as true
  })
);

app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/likes', likesRouter);
app.use('/api/v1/comments', commentsRouter);


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