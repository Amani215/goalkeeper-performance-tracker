import { createContext, PropsWithChildren, useContext } from "react";
import { LoginDTO } from "../DTOs/LoginDTO";
import { errorResponse } from "../interfaces/errorResponse";

type LoginDelegate = (
  username: string,
  password: string
) => Promise<LoginDTO | errorResponse>;

const loginContext = createContext<LoginDelegate | null>(null);

export function useLogin() {
  return useContext(loginContext);
}

export default function LoginProvider(props: PropsWithChildren<{}>) {
    const login:LoginDelegate = (username:string,password:string)=> {
        return fetch("/api/auth",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                username,password
            })
        })
        .then(data=>data.json())
        .then(data=> {
            if ('token' in data) {
                localStorage.setItem("loginDTO",JSON.stringify(data))
                window.location.reload()
            }
            return data as LoginDTO
        })
    }
    return (
        <loginContext.Provider value={login}>
            {props.children}
        </loginContext.Provider>
    )
}
