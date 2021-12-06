import { body } from "express-validator";

const authorValidation = [
  body("name").exists().withMessage("Name is a mandatory field!").custom(),
  body("surname").exists().withMessage("Surname is a mandatory field!"),
  body("age")
    .exists()
    .withMessage("Age is a mandatory field!")
    .isInt()
    .withMessage("Age should be an integer!"),
  body("email")
    .exists()
    .withMessage("Email is a mandatory field")
    .isEmail()
    .withMessage("Email not valid"),
];

// name
// surname
// ID (Unique and server generated)
// email
// date of birth
// avatar (e.g. https://ui-avatars.com/api/?name=John+Doe)

export default authorValidation;
