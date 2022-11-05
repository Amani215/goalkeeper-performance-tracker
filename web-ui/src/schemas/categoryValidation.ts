import * as yup from "yup";

const categoryValidationSchema = yup.object({
  name: yup.string().required("Category name is required"),
  season: yup
    .number()
    .min(1900)
    .max(2100)
    .typeError("Please enter a valid year")
    .required("Season is required"),
});

export default categoryValidationSchema;
