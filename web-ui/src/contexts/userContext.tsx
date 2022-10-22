import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { UserDTO } from "../DTOs";
import { LoginDTO } from "../DTOs/LoginDTO";


const userContext = createContext<UserDTO | null>(null)

export function useUser() {
    return useContext(userContext)
}

export default function UserProvider(props: PropsWithChildren<{}>) {
    const [currentUser, setCurrentUser] = useState<UserDTO | null>(null)
    useEffect(() => {
        const { token, user }: LoginDTO = JSON.parse(localStorage.getItem("loginDTO") || "{}")
        fetch("/api/auth", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
        }).then(response => {
            if (response.status === 200) {
                setCurrentUser(user)
                return
            }
            localStorage.removeItem("loginDTO")
        })
    }, [])
    return (
        <userContext.Provider value={currentUser}>
            {props.children}
        </userContext.Provider>
    )
}