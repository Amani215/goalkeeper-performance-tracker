export interface MatchDTO {
  id: string;
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
