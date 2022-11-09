import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO, UserDTO } from '../DTOs';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';

// GET USER CONTEXTS
type UserDelegate = (id: string) => Promise<UserDTO | errorResponse>;
const userContext = createContext<UserDelegate | null>(null);
export function useUser() {
    return useContext(userContext);
}

const userErrorContext = createContext<boolean>(false);
export function useUserError() {
    return useContext(userErrorContext);
}

const userReadyContext = createContext<boolean>(false);
export function useUserReady() {
    return useContext(userReadyContext);
}

// GET CATEGORIES CONTEXT
type UserCategoriesDelegate = (id: string) => Promise<CategoryDTO[] | errorResponse>;
const userCategoriesContext = createContext<UserCategoriesDelegate | null>(null)
export function useUserCategories() {
    return useContext(userCategoriesContext)
}

const userCategoriesReadyContext = createContext<boolean>(false);
export function useUserCategoriesReady() {
    return useContext(userCategoriesReadyContext);
}

// PROFILE PIC CONTEXT
type PictureDelegate = (formdata: FormData) => Promise<string | errorResponse>;
const updateProfilePicContext = createContext<PictureDelegate | null>(null);
export function useUpdateProfilePic() {
    return useContext(updateProfilePicContext);
}

// PROVIDER
export default function UserProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [userReady, setUserReady] = useState<boolean>(false)

    const [userCategoriesReady, setUserCategoriesReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const user: UserDelegate = async (id: string) => {
        const data = await fetch("/api/user?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setUserReady(true);
            setError(false);
            return json_data as UserDTO;
        }
        else {
            setError(true);
            setUserReady(true);
            return json_data as errorResponse;
        }
    }

    const categories: UserCategoriesDelegate = async (id: string) => {
        const data = await fetch("/api/user/category?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setError(false);
            return json_data as CategoryDTO[];
        }
        else {
            setUserCategoriesReady(true)
            setError(true);
            return json_data as errorResponse;
        }
    }

    const profile_pic: PictureDelegate = (formdata: FormData) => {
        return fetch("/api/user/profile_pic", {
            method: "PUT",
            headers: {
                'Accept': '*/*',
                'Authorization': `bearer ${token}`
            },
            body: formdata
        })
            .then(data => data.json())
    }

    return (
        <userContext.Provider value={user}>
            <userErrorContext.Provider value={error}>
                <userReadyContext.Provider value={userReady}>
                    <updateProfilePicContext.Provider value={profile_pic}>
                        <userCategoriesContext.Provider value={categories}>
                            <userCategoriesReadyContext.Provider value={userCategoriesReady}>
                                {props.children}
                            </userCategoriesReadyContext.Provider>
                        </userCategoriesContext.Provider>
                    </updateProfilePicContext.Provider>
                </userReadyContext.Provider>
            </userErrorContext.Provider>
        </userContext.Provider>
    )
}