import { body } from "express-validator";

const postValidation = [
  body("category").exists().withMessage("You have to provide the category"),
  body("title").exists().withMessage("You have to provide the title"),
  body("content").exists().withMessage("You have to specify content"),
];
export default postValidation;
