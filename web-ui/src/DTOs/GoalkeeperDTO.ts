export interface GoalkeeperDTO {
  id: string;
  name: string;
  birthday: string;
  phone: string;
  picture: string;
}

export interface NewGoalkeeperDTO {
  name: string;
  day: number;
  month: number;
  year: number;
}
