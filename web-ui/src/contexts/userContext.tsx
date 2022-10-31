import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { UserDTO } from "../DTOs";
import { LoginDTO } from "../DTOs/LoginDTO";


const userContext = createContext<UserDTO | null>(null)
const userReadyContext = createContext<boolean>(false)

export function useUser() {
    return useContext(userContext)
}
export function useUserReady(){
    return useContext(userReadyContext)
}

export default function UserProvider(props: PropsWithChildren<{}>) {
    const [currentUser, setCurrentUser] = useState<UserDTO | null>(null)
    const [userReady,setUserReady] = useState<boolean>(false)
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
                setUserReady(true)
                return
            }
            setUserReady(true)
            localStorage.removeItem("loginDTO")
        })
    }, [])
    return (
        <userContext.Provider value={currentUser}>
            <userReadyContext.Provider value={userReady}>
                {props.children}
            </userReadyContext.Provider>
        </userContext.Provider>
    )
}