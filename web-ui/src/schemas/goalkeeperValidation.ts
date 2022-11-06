import * as yup from "yup";

const goalkeeperValidationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Username should be of minimum 4 characters length")
    .required("Username is required"),
  day: yup
    .number()
    .min(1, "Day cannot be negative")
    .max(31, "Day cannot exceed 31")
    .required("Day is required"),
  month: yup
    .number()
    .min(1, "Month cannot be negative")
    .max(12, "Month cannot exceed 12")
    .required("Month is required"),
  year: yup
    .number()
    .min(1970, "Year cannot be prior to 1970")
    .max(2100, "Year cannot exceed 2100")
    .required("Year is required"),
});

export default goalkeeperValidationSchema;
