import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
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

export default function AuthProvider(props: Readonly<PropsWithChildren<{}>>) {
    const [auth, setAuth] = useState<LoginDTO | null>(null)

    const [authReady, setAuthReady] = useState<boolean>(false)

    const logout: VoidDelegate = useCallback(() => {
        localStorage.removeItem("loginDTO")
        setAuth(null)

        setAuthReady(true)
    }, [])

    useEffect(() => {
        const initializeAuth = async () => {
            const localAuth: LoginDTO = JSON.parse(localStorage.getItem("loginDTO") ?? "{}")
            if (!localAuth) {
                setAuthReady(true); // No auth data found
                return;
            }

            try {
                const response = await fetch("/api/auth", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `bearer ${localAuth.token}`
                    },
                });

                if (response.ok) {
                    setAuth(localAuth); // token is valid
                } else {
                    localStorage.removeItem("loginDTO"); // invalid token. remove it
                }
            } catch (error) {
                console.log("Error while validating the token: ", error);
            } finally {
                setAuthReady(true);
            }
        }

        initializeAuth();
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