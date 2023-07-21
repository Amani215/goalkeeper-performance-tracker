export interface UserDTO {
  id: string;
  username: string;
  admin: boolean;
  profile_pic: string;
  first_login: boolean;
  archived: boolean;
  archive_reason: string;
}

export interface NewUserDTO {
  password: string;
  username: string;
  admin: boolean;
  profile_pic: string;
}
