import { CategoryDTO } from "./CategoryDTO";

export interface CalendarDTO {
  id: string;
  category: CategoryDTO;
  calendar_type: string;
  journey: number;
  local: string;
  visitor: string;
}

export interface NewCalendarDTO {
  category_id: string;
  calendar_type: string;
  journey: number;
  local: string;
  visitor: string;
}
