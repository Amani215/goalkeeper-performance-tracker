// Context for dropdown menus. 
// Data comes from Redis.
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";

type ParamsDelegate = (param: string) => Promise<string[] | errorResponse>;
const paramsContext = createContext<ParamsDelegate | null>(null);
export function useParams() {
    return useContext(paramsContext);
}

export default function ParamsProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)

    const auth = useAuth()
    const token = auth?.token

    const params: ParamsDelegate = async (param: string) => {
        const data = await fetch("/api/redis/" + param, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('error' in json_data) {
            setError(true)
            return []
        }
        else {
            setError(false);
            return json_data as string[];
        }
    }

    return (
        <paramsContext.Provider value={params}>
            {props.children}
        </paramsContext.Provider>
    )
}