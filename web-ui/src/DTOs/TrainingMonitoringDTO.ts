import { GoalkeeperDTO } from "./GoalkeeperDTO";
import { TrainingDTO } from "./TrainingDTO";

export interface TrainingMonitoringDTO {
  id: string;
  goalkeeper: GoalkeeperDTO;
  session: TrainingDTO;
  absent: boolean;
  dismissed: boolean;
  hurt: boolean;
  with_seniors: boolean;
  with_national_team: boolean;
  training_form: string;
  comment: string;
}
