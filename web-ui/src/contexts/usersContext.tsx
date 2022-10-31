import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { UserDTO } from "../DTOs";
import { LoginDTO } from "../DTOs/LoginDTO";

const usersContext = createContext<UserDTO[] | null>(null)
export function useUsers() {
    return useContext(usersContext)
}

const usersReadyContext = createContext<boolean>(false)
export function useUsersReady() {
    return useContext(usersReadyContext)
}

export default function UsersProvider(props: PropsWithChildren<{}>) {
    const [users, setUsers] = useState<UserDTO[] | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

    const getUsers = async () => {
        const { token, }: LoginDTO = JSON.parse(localStorage.getItem("loginDTO") || "{}")
        const usersArray: UserDTO[] = await fetch("/api/user", {
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
                return usersDTO
            })

        setUsers(usersArray)
        setLoaded(true)
    }

    useEffect(() => {
        getUsers()
    }, [loaded])

    return (
        <usersContext.Provider value={users}>
            <usersReadyContext.Provider value={loaded}>
                {props.children}
            </usersReadyContext.Provider>
        </usersContext.Provider>
    )
}