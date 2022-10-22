import * as yup from "yup";

const loginValidationSchema = yup.object({
  username: yup
    .string()
    .min(4, "Username should be of minimum 4 characters length")
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
});

export default loginValidationSchema;
