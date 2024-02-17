import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react'
import { CategoryDTO, UserDTO } from '../DTOs';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';

// GET USER CONTEXTS
type UserDelegate = (id: string) => Promise<UserDTO | errorResponse>;
const getUserContext = createContext<UserDelegate | null>(null);
export function useGetUser() {
    return useContext(getUserContext);
}

const userContext = createContext<UserDTO | null>(null);
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

// UPDATE STATUS CONTEXT
type UpdateUserStatusDelegate = (id: string, status: boolean) => Promise<UserDTO | errorResponse>;
const updateUserStatusContext = createContext<UpdateUserStatusDelegate | null>(null);
export function useUpdateUserStatus() {
    return useContext(updateUserStatusContext);
}

const userUpdatedContext = createContext<boolean>(false);
export function useUserUpdated() {
    return useContext(userUpdatedContext);
}

// UPDATE ARCHIVED STATUS CONTEXT
type UpdateUserArchiveDelegate = (id: string, archived: boolean, archive_reason: string) => Promise<UserDTO | errorResponse>;
const updateUserArchiveContext = createContext<UpdateUserArchiveDelegate | null>(null);
export function useUpdateUserArchive() {
    return useContext(updateUserArchiveContext);
}

// UPDATE PASSWORD CONTEXT
type UpdateUserPasswordDelegate = (id: string, password: string) => Promise<UserDTO | errorResponse>;
const updateUserPasswordContext = createContext<UpdateUserPasswordDelegate | null>(null);
export function useUpdateUserPassword() {
    return useContext(updateUserPasswordContext);
}

// PROVIDER
export default function UserProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [user, setUser] = useState<UserDTO | null>(null)
    const [userReady, setUserReady] = useState<boolean>(false)
    const [userUpdated, setUserUpdated] = useState<boolean>(false);

    const [userCategoriesReady, setUserCategoriesReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const getUser: UserDelegate = useCallback(async (id: string) => {
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
            setUser(json_data as UserDTO);
            return json_data as UserDTO;
        }
        else {
            setError(true);
            setUserReady(true);
            setUser(null);
            return json_data as errorResponse;
        }
    }, [token])

    const categories: UserCategoriesDelegate = useCallback(async (id: string) => {
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
    }, [token])

    const profile_pic: PictureDelegate = useCallback((formdata: FormData) => {
        return fetch("/api/user/profile_pic", {
            method: "PUT",
            headers: {
                'Accept': '*/*',
                'Authorization': `bearer ${token}`
            },
            body: formdata
        })
            .then(data => data.json())
    }, [token])

    const updateUserStatus: UpdateUserStatusDelegate = useCallback(async (username: string, status: boolean) => {
        const data = await fetch("/api/user/admin", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                admin: status
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setUserReady(true);
            setError(false);
            setUser(json_data as UserDTO)
            setUserUpdated(true)
            return json_data as UserDTO;
        }
        else {
            setError(true);
            setUserReady(true);
            setUser(null)
            return json_data as errorResponse;
        }
    }, [token])

    const updateUserArchive: UpdateUserArchiveDelegate = useCallback(async (username: string, archived: boolean, archive_reason: string) => {
        const data = await fetch("/api/user/archived", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                archived: archived,
                reason: archive_reason
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setUserReady(true);
            setError(false);
            setUser(json_data as UserDTO)
            setUserUpdated(true)
            return json_data as UserDTO;
        }
        else {
            setError(true);
            setUserReady(true);
            setUser(null)
            return json_data as errorResponse;
        }
    }, [token])

    const updateUserPassword: UpdateUserPasswordDelegate = useCallback(async (user_id: string, password: string) => {
        const data = await fetch("/api/user?id=" + user_id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                password: password,
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setUserReady(true);
            setError(false);
            setUser(json_data as UserDTO)
            setUserUpdated(true)
            return json_data as UserDTO;
        }
        else {
            setError(true);
            setUserReady(true);
            setUser(null)
            return json_data as errorResponse;
        }
    }, [token])

    return (
        <getUserContext.Provider value={getUser}>
            <userContext.Provider value={user}>
                <userErrorContext.Provider value={error}>
                    <userReadyContext.Provider value={userReady}>
                        <updateProfilePicContext.Provider value={profile_pic}>
                            <updateUserStatusContext.Provider value={updateUserStatus}>
                                <updateUserArchiveContext.Provider value={updateUserArchive}>
                                    <userUpdatedContext.Provider value={userUpdated}>
                                        <userCategoriesContext.Provider value={categories}>
                                            <userCategoriesReadyContext.Provider value={userCategoriesReady}>
                                                <updateUserPasswordContext.Provider value={updateUserPassword}>
                                                    {props.children}
                                                </updateUserPasswordContext.Provider>
                                            </userCategoriesReadyContext.Provider>
                                        </userCategoriesContext.Provider>
                                    </userUpdatedContext.Provider>
                                </updateUserArchiveContext.Provider>
                            </updateUserStatusContext.Provider>
                        </updateProfilePicContext.Provider>
                    </userReadyContext.Provider>
                </userErrorContext.Provider>
            </userContext.Provider>
        </getUserContext.Provider>
    )
}