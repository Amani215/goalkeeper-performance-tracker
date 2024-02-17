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

type UpdateParamDelegate = (key: string, value: string) => Promise<null | errorResponse>;
const newParamContext = createContext<UpdateParamDelegate | null>(null);
export function useNewParam() {
    return useContext(newParamContext);
}

const deleteParamContext = createContext<UpdateParamDelegate | null>(null);
export function useDeleteParam() {
    return useContext(deleteParamContext);
}

const paramUpdatedContext = createContext<boolean>(false);
export function useParamUpdated() {
    return useContext(paramUpdatedContext);
}


export default function ParamsProvider(props: PropsWithChildren<{}>) {
    const [, setError] = useState(false)
    const [paramUpdated, setParamUpdated] = useState(false)

    const auth = useAuth()
    const token = auth?.token

    const params: ParamsDelegate = async (param: string) => {
        const data = await fetch("/api/settings/" + param, {
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

    const newParam: UpdateParamDelegate = async (key: string, value: string) => {
        const data = await fetch("/api/settings/" + key, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                value: value
            })
        });
        const data_1 = await data.json();
        if ("error" in data_1) {
            setError(true);
            return data_1 as errorResponse;
        } else {
            setError(false);
            setParamUpdated(true);
            return null;
        }
    }

    const deleteParam: UpdateParamDelegate = async (key: string, value: string) => {
        const data = await fetch("/api/settings/" + key, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                value: value
            })
        });
        if (data.status == 204) {
            setParamUpdated(true);
            return null;
        }
        const data_json = await data.json();
        setError(true);
        setParamUpdated(false);
        return data_json as errorResponse;
    }

    return (
        <paramsContext.Provider value={params}>
            <newParamContext.Provider value={newParam}>
                <deleteParamContext.Provider value={deleteParam}>
                    <paramUpdatedContext.Provider value={paramUpdated}>
                        {props.children}
                    </paramUpdatedContext.Provider>
                </deleteParamContext.Provider>
            </newParamContext.Provider>
        </paramsContext.Provider>
    )
}