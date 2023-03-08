export interface NewGrowthDTO {
  goalkeeper_id: string;
  date: string;
}

export interface GrowthDTO {
  id: string;
  goalkeeper_id: string;
  date: string;
  annual_growth: string;
  height: string;
  weight: string;
  torso_height: string;
  thoracic_perimeter: string;
}
