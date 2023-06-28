export interface NewPlanningDTO {
  category_id: string;
  date: string;
  type: string;
}

export interface PlanningDTO {
  id: string;
  category_id: string;
  date: string;
  type: string;
  techniques: string;
  physiques: string;
  psychomotricity: string;
  tactics: string;
  observation: string;
}

export interface UpdatePlanningDTO {
  date: string;
  type: string;
  techniques: string;
  physiques: string;
  psychomotricity: string;
  tactics: string;
  observation: string;
}
