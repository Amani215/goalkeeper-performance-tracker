import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { UserDTO } from '../DTOs';
import { errorResponse } from '../interfaces/errorResponse';

// GET USER CONTEXTS
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

// ADD USER CONTEXTS
type NewUserDelegate = (
    token: string,
    username: string,
    password: string,
    admin: boolean,
    profile_pic: string
) => Promise<string | errorResponse>;

const newUserContext = createContext<NewUserDelegate | null>(null);
export function useNewUser() {
    return useContext(newUserContext);
}

const newUserErrorContext = createContext<boolean>(false);
export function useNewUserError() {
    return useContext(newUserErrorContext);
}

export default function UserProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [newUserError, setNewUserError] = useState(false)
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

    const newUser: NewUserDelegate = (
        token: string,
        username: string,
        password: string,
        admin: boolean,
        profile_pic: string) => {
        return fetch("/api/user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                username: username,
                password: password,
                admin: admin
            })
        })
            .then(data => data.json())
        // .then(data=>{
        //     if("error" in data){
        //         setNewUserError(true)
        //         return data as errorResponse
        //     }else{
        //         setNewUserError(false)
        //         return data.toString()
        //     }
        // })
    }

    return (
        <userContext.Provider value={user}>
            <userErrorContext.Provider value={error}>
                <userReadyContext.Provider value={userReady}>
                    <newUserContext.Provider value={newUser}>
                        <newUserErrorContext.Provider value={newUserError}>
                            {props.children}
                        </newUserErrorContext.Provider>
                    </newUserContext.Provider>
                </userReadyContext.Provider>
            </userErrorContext.Provider>
        </userContext.Provider>
    )
}