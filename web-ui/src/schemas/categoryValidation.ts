import * as yup from "yup";

const categoryValidationSchema = yup.object({
  name: yup.string().required("Category name is required"),
  season: yup.string().required("Season is required"),
});

export default categoryValidationSchema;
