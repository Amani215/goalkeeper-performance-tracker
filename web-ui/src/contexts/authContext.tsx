import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { LoginDTO } from "../DTOs/LoginDTO";
import { VoidDelegate } from "../interfaces/voidDelegate";


const authContext = createContext<LoginDTO | null>(null)
const authReadyContext = createContext<boolean>(false)
const logoutContext = createContext<VoidDelegate | null>(null)

export function useLogout() {
    return useContext(logoutContext)
}
export function useAuth() {
    return useContext(authContext)
}
export function useAuthReady() {
    return useContext(authReadyContext)
}

export default function UserProvider(props: PropsWithChildren<{}>) {
    const [auth, setAuth] = useState<LoginDTO | null>(null)

    const [authReady, setAuthReady] = useState<boolean>(false)
    const logout: VoidDelegate = () => {
        localStorage.removeItem("loginDTO")
        setAuth(null)

        setAuthReady(true)
    }
    useEffect(() => {
        const localAuth: LoginDTO = JSON.parse(localStorage.getItem("loginDTO") || "{}")

        fetch("/api/auth", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localAuth.token}`
            },
        }).then(response => {
            if (response.status === 200) {
                setAuth(localAuth)
                setAuthReady(true)
                return
            }
            setAuthReady(true)
            localStorage.removeItem("loginDTO")
        })
    }, [])
    return (
        <authContext.Provider value={auth}>
            <authReadyContext.Provider value={authReady}>
                <logoutContext.Provider value={logout}>
                    {props.children}
                </logoutContext.Provider>
            </authReadyContext.Provider>
        </authContext.Provider>
    )
}