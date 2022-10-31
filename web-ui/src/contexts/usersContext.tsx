import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { UserDTO } from "../DTOs";
import { LoginDTO } from "../DTOs/LoginDTO";


const usersContext = createContext<UserDTO[] | null>(null)

export function useUsers() {
    return useContext(usersContext)
}

export default function UsersProvider(props: PropsWithChildren<{}>) {
    const [users, setUsers] = useState<UserDTO[] | null>(null)
    useEffect(() => {
        const { token, }: LoginDTO = JSON.parse(localStorage.getItem("loginDTO") || "{}")
        fetch("/api/user", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => data.json())
            .then(data => {
                setUsers(data as UserDTO[])
                return data
            })
    }, [])
    return (
        <usersContext.Provider value={users}>
            {props.children}
        </usersContext.Provider>
    )
}