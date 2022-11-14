import { CategoryDTO } from "./CategoryDTO";

export interface MatchDTO {
  id: string;
  category: CategoryDTO;
  date: string;
  local: string;
  visitor: string;
  match_type: string;
  score_local: number;
  score_visitor: number;
}

export interface NewMatchDTO {
  date: string;
  local: string;
  visitor: string;
  match_type: string;
  category_id: string;
}
