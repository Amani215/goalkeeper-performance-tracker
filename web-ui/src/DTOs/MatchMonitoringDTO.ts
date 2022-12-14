import { GoalkeeperDTO } from "./GoalkeeperDTO";
import { MatchDTO } from "./MatchDTO";

export interface MatchMonitoringDTO {
  id: string;
  goalkeeper: GoalkeeperDTO;
  match: MatchDTO;
  time_played: number;
  goals_scored: number;
  goals_conceded: number;
  penalties_saved: number;
  penalties_non_saved: number;
  yellow_cards: number;
  red_cards: number;
  grade: number;
  assets: string;
  flaws: string;
  comment: string;
}

export interface UpdateMatchMonitoringDTO {
  id: string;
  time_played: number;
  goals_scored: number;
  goals_conceded: number;
  penalties_saved: number;
  penalties_non_saved: number;
  yellow_cards: number;
  red_cards: number;
  grade: number;
  assets: string;
  flaws: string;
  comment: string;
}
