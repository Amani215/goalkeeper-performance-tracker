import { CategoryDTO } from "./CategoryDTO";

export interface TrainingDTO {
  id: string;
  date: string;
  duration: number;
  category: CategoryDTO;
  training_form: string;
}
