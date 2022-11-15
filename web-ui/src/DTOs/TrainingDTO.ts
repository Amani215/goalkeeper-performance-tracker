import { CategoryDTO } from "./CategoryDTO";

export interface TrainingDTO {
  id: string;
  date: string;
  category: CategoryDTO;
}
