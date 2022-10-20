import {UserDTO} from './UserDTO';

export interface LoginDTO {
  token: string;
  user: UserDTO
}
