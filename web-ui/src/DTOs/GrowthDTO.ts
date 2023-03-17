export interface NewGrowthDTO {
  goalkeeper_id: string;
  date: string;
}

export interface GrowthDTO {
  id: string;
  goalkeeper_id: string;
  date: string;
  annual_growth: number;
  height: number;
  weight: number;
  torso_height: number;
  thoracic_perimeter: number;
}

export interface UpdateGrowthDTO {
  date: string;
  annual_growth: number;
  height: number;
  weight: number;
  torso_height: number;
  thoracic_perimeter: number;
}
