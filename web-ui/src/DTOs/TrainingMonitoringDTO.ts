import { GoalkeeperDTO } from "./GoalkeeperDTO";
import { TrainingDTO } from "./TrainingDTO";

export interface TrainingMonitoringDTO {
  id: string;
  goalkeeper: GoalkeeperDTO;
  session: TrainingDTO;
  attendance: string;
}

export interface UpdateTrainingMonitoringDTO {
  id: string;
  attendance: string;
}
