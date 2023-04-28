export interface CategoryDTO {
  id: string;
  name: string;
  season: string;
  archived: boolean;
}

export interface NewCategoryDTO {
  name: string;
  season: string;
}
