import * as yup from "yup";

const passwordValidation = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Your password is too short."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default passwordValidation;
