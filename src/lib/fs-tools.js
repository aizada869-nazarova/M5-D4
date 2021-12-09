import fs, { writeFile } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { dir } from "console";

const { readJSON, writeJSON, createReadStream } = fs;

const authorsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../jsondata/authors.json"
);
const blogPostsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../jsondata/blogPosts.json"
);
const commentsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../jsondata/comments.json"
);
const authorsPublicFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/users"
);

export const getAuthors = async () => await readJSON(authorsJSONpath);
export const getBlogPosts = async () => await readJSON(blogPostsJSONpath);
export const getComments = async () => await readJSON(commentsJSONpath);
export const writeAuthors = async (content) =>
  await writeJSON(authorsJSONpath, content);
export const writeBlogPosts = async (content) =>
  await writeJSON(blogPostsJSONpath, content);
export const getCurrentFolderPath = async (currentFile) =>
  await dirname(fileURLToPath(currentFile));
export const writeCoverPicture = async (fileName, content) =>
  await writeFile(join(blogPostsJSONpath, fileName), content);
export const writeAuthorImage = async (filename, content) =>
  await writeFile(join(authorsPublicFolderPath, filename), content);

  export const getBlogReadableStream = () => createReadStream(blogPostsJSONpath)
  export const getAuthorsReadableStream = () => createReadStream(authorsJSONpath)


