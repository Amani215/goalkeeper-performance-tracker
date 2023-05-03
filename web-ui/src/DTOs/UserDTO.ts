export interface UserDTO {
  id: string;
  username: string;
  admin: boolean;
  profile_pic: string;
  first_login: boolean;
}

export interface NewUserDTO {
  password: string;
  username: string;
  admin: boolean;
  profile_pic: string;
}
