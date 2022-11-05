import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { UserDTO } from "../DTOs";
import { NewUserDTO } from "../DTOs/UserDTO";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";

// GET USERS CONTEXTS
const usersContext = createContext<UserDTO[] | null>(null)
export function useUsers() {
    return useContext(usersContext)
}

const usersReadyContext = createContext<boolean>(false)
export function useUsersReady() {
    return useContext(usersReadyContext)
}

// ADD USER CONTEXTS
type NewUserDelegate = (newUserObj: NewUserDTO) => Promise<UserDTO | errorResponse>;
const newUserContext = createContext<NewUserDelegate | null>(null);
export function useNewUser() {
    return useContext(newUserContext);
}

const newUserErrorContext = createContext<boolean>(false);
export function useNewUserError() {
    return useContext(newUserErrorContext);
}

export default function UsersProvider(props: PropsWithChildren<{}>) {
    const [users, setUsers] = useState<UserDTO[] | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

    const [newUserError, setNewUserError] = useState(false)

    const auth = useAuth()
    const token = auth?.token

    const getUsers = async () => {
        if (token) {
            await fetch("/api/user", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`
                }
            })
                .then(data => data.json())
                .then((data) => {
                    const dataString = JSON.stringify(data)
                    const usersDTO: UserDTO[] = JSON.parse(dataString)
                    setUsers(usersDTO)
                    setLoaded(true)
                })
        }

    }

    const newUser: NewUserDelegate = (newUserObj: NewUserDTO) => {
        return fetch("/api/user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                username: newUserObj.username,
                password: newUserObj.password,
                admin: newUserObj.admin
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setNewUserError(true)
                    return data as errorResponse
                } else {
                    setNewUserError(false)
                    setUsers([...users as UserDTO[], data as UserDTO])
                    return data as UserDTO
                }
            })
    }

    useEffect(() => {
        getUsers()
    }, [loaded, token])

    return (
        <usersContext.Provider value={users}>
            <usersReadyContext.Provider value={loaded}>
                <newUserContext.Provider value={newUser}>
                    <newUserErrorContext.Provider value={newUserError}>
                        {props.children}
                    </newUserErrorContext.Provider>
                </newUserContext.Provider>
            </usersReadyContext.Provider>
        </usersContext.Provider>
    )
}