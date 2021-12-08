import express from "express";
import uniqid from "uniqid";
import fs from "fs";
import createError from "http-errors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { validationResult } from "express-validator";
import postValidation from "./postValidation.js";
import { getBlogPDFReadeableSt } from "../../lib/pdf-tools.js"
import { getBlogReadableStream } from "../../lib/fs-tools.js"
import { pipeline } from "stream";

const blogPostsRouter = express.Router();

const blogPostsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../jsondata/blogPosts.json"
);

const getBlogPostArray = () => {
  const content = fs.readFileSync(blogPostsJSONpath);
  return JSON.parse(content);
};

const writeBlogPosts = (content) => {
  fs.writeFileSync(blogPostsJSONpath, JSON.stringify(content));
};

//1. GET ALL blogPosts
blogPostsRouter.get("/", (req, res, next) => {
  try {
    const posts = getBlogPostArray();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

//2 GET Single Post
blogPostsRouter.get("/:id", postValidation, (req, res, next) => {
  try {
    const posts = getBlogPostArray();
    const post = posts.find((post) => post.id === req.params.id);
    if (post) {
      res.send(post);
    } else {
      next(createError(404, "this is an error , your problem fix it."));
    }
  } catch (error) {
    next(error);
  }
});

//3 POST blogPost
blogPostsRouter.post("/", (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const newPost = { ...req.body, id: uniqid(), createdAt: new Date() };
      const posts = getBlogPostArray();
      posts.push(newPost);
      writeBlogPosts(posts);
      res.status(201).send({ id: newPost.id });
    } else {
      next(createError(400, { errorsList: errors }));
    }
  } catch (error) {
    next(error);
  }
});

//4 PUT blogPost
blogPostsRouter.put("/:id", (req, res, next) => {
  try {
    const posts = getBlogPostArray();
    const remainingPosts = posts.filter((post) => post.id !== req.params.id);
    const modifiedPost = {
      ...req.body,
      id: req.params.postId,
      modifiedAt: new Date(),
    };
    remainingPosts.push(modifiedPost);
    writeBlogPosts(remainingPosts);
    res.status(222).send("modified");
  } catch (error) {
    next(error);
  }
});

// 5. DELETE blogPost
blogPostsRouter.delete("/:id", (req, res, next) => {
  try {
    const posts = getBlogPostArray();
    const remainingPosts = posts.filter((post) => post.id !== req.params.id);
    writeBlogPosts(remainingPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});


blogPostsRouter.get("/:id/pdf", postValidation, (req, res, next) => {
  try {
    const posts = getBlogPostArray();
    const post = posts.find((post) => post._id === req.params.id);
    if (post) {
      const source = getBlogPDFReadeableSt(post);
     // res.setHeader("Content-Disposition", "attachment; filename=blog.pdf");
      res.setHeader("Content-Type", "application/pdf");
      pipeline(source, res, (err) => {
        if (err) {
          next(createError(400, "pdf"))
        }
      })

      source.end()
    } else {
      next(createError(404, "this is an error , you have a problem fix it."));
    }

  } catch (error) {
    next(createError(400, "pdf"));
  }
});
export default blogPostsRouter;
