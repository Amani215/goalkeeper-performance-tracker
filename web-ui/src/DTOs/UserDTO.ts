import {CategoryDTO} from './CategoryDTO';

export interface UserDTO {
	id: string;
	username: string;
	password: string;
    admin: boolean;
    profile_pic: string;
    categories: CategoryDTO[]
}