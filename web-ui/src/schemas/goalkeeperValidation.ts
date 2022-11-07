import * as yup from "yup";
import dayjs from "dayjs";

const goalkeeperValidationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Username should be of minimum 4 characters length")
    .required("Username is required"),
  birthday: yup
    .date()
    .max(dayjs(), "Birthday cannot be a future date")
    .required("Birthday is required"),
});

export default goalkeeperValidationSchema;
