export interface MatchDTO {
  id: string;
  date: string;
  local: string;
  visitor: string;
  match_type: string;
}

export interface NewMatchDTO {
  date: string;
  local: string;
  visitor: string;
  match_type: string;
}
