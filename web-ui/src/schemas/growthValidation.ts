import * as yup from "yup";

const growthValidationSchema = yup.object({
  date: yup.date(),
  height: yup.number().min(0, "Height cannot be a negative number"),
  wight: yup.number().min(0, "Weight cannot be a negative number"),
  annualGrowth: yup.number(),
  torsoHeight: yup.number().min(0, "Torso Height cannot be a negative number"),
  thoracicPerimeter: yup
    .number()
    .min(0, "Thoracic perimeter cannot be a negative number"),
});

export default growthValidationSchema;
