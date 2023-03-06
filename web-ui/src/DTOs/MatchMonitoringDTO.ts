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
  balls_touched: number;
  non_successful_ballon_profondeur: number;
  non_successful_deliveries: number;
  non_successful_foot_relaunch: number;
  non_successful_hand_relaunch: number;
  successful_ballon_profondeur: number;
  successful_deliveries: number;
  successful_foot_relaunch: number;
  successful_hand_relaunch: number;
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
