import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import authorsRouter from "./services/authors/index.js";
import blogPostsRouter from "./services/blogPosts/index.js";
import filesRouter from "./services/files/index.js"
import commentsRouter from "./services/comments/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";

const server = express();
const PORT = process.env.PORT

const loggerMiddleware2 = (req, res, next) => {
  console.log(`Request --> ${req.method} ${req.url} -- ${new Date()}`);
  next(); // mandatory to give the control to what is happening next
};
// server.use(express.static(publicFolderPath));


const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL]

const corsOptions = {
  origin: function (origin, next) {
    
    console.log("ORIGIN: ", origin)

    if (!origin || whiteList.indexOf(origin) !== -1) {
      
      next(null, true)
    } else {
     
      next(new Error("CORS ERROR!"))
    }
  },
}

server.use(cors(corsOptions))

server.use(express.json());
// server.use(loggerMiddleware); // GLOBAL MIDDLEWARE
server.use("/author", authorsRouter);
server.use("/blog/", loggerMiddleware2, blogPostsRouter);
server.use("/blog/comments", commentsRouter);
server.use("/files", filesRouter)

// *************************** ERROR MIDDLEWARES ***************************

server.use(notFoundErrorHandler);
server.use(badRequestErrorHandler);
server.use(catchAllErrorHandler);

console.table(listEndpoints(server));
server.listen(PORT, () =>
  console.log(`✅ A portal has opened on ${PORT} , enter if you dare`)
);

server.on("error", (error) =>
  console.log(`❌ Server is not running due to the following oopsie : ${error}`)
);
