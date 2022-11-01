import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { UserDTO } from '../DTOs';
import { errorResponse } from '../interfaces/errorResponse';
import { VoidDelegate } from '../interfaces/voidDelegate';

type UserDelegate = (
    token: string,
    id: string
) => Promise<UserDTO | errorResponse>;

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

export default function UserProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [userReady, setUserReady] = useState<boolean>(false)

    const user: UserDelegate = (token: string, id: string) => {
        return fetch("/api/user?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => data.json())
            .then(data => {
                if ('id' in data) {
                    setUserReady(true)
                    return data as UserDTO
                }
                else {
                    setError(true)
                    setUserReady(true)
                    return data as errorResponse
                }
            })
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