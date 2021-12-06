import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";

import authorsRouter from "./services/authors/index.js";
import blogPostsRouter from "./services/blogPosts/index.js";
import commentsRouter from "./services/comments/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";

const server = express();
const PORT = process.env.PORT
// const publicFolderPath = join(
//   getCurrentFolderPath(import.meta.url),
//   "../public"
// );
// ************************** MIDDLEWARES **************************

// const loggerMiddleware = (req, res, next) => {
//   console.log(`Request --> ${req.method} ${req.url} -- ${new Date()}`);
//   next(); // mandatory to give the control to what is happening next
// };

const loggerMiddleware2 = (req, res, next) => {
  console.log(`Request --> ${req.method} ${req.url} -- ${new Date()}`);
  next(); // mandatory to give the control to what is happening next
};
// server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());
// server.use(loggerMiddleware); // GLOBAL MIDDLEWARE
server.use("/author", authorsRouter);
server.use("/blog", loggerMiddleware2, blogPostsRouter);
server.use("/blog/comments", commentsRouter);
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
