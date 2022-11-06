import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { UserDTO } from '../DTOs';
import { NewUserDTO } from '../DTOs/UserDTO';
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

// PROVIDER
export default function UserProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [userReady, setUserReady] = useState<boolean>(false)

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

    return (
        <userContext.Provider value={user}>
            <userErrorContext.Provider value={error}>
                <userReadyContext.Provider value={userReady}>
                    {props.children}
                </userReadyContext.Provider>
            </userErrorContext.Provider>
        </userContext.Provider>
    )
}