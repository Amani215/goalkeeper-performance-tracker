import { CategoryDTO } from "./CategoryDTO";

export interface CalendarDTO {
  id: string;
  category: CategoryDTO;
  calendar_type: string;
  items: CalendarItemDTO[];
}

export interface NewCalendarDTO {
  category_id: string;
  calendar_type: string;
}

export interface CalendarItemDTO {
  calendar_id: string;
  journey: number;
  local: string;
  visitor: string;
}

export interface NewCalendarItemDTO {
  calendar_id: string;
  journey: number;
  local: string;
  visitor: string;
}
