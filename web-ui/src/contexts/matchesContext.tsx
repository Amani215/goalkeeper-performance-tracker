import { createContext, PropsWithChildren, useContext, useState } from "react";
import { MatchDTO } from "../DTOs/MatchDTO";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";

// GET MATCHES CONTEXT
type MatchesDelegate = (past: boolean) => Promise<MatchDTO[] | errorResponse>;
const matchesContext = createContext<MatchesDelegate | null>(null);
export function useMatches() {
    return useContext(matchesContext);
}

const matchesReadyContext = createContext<boolean>(false)
export function useMatchesReady() {
    return useContext(matchesReadyContext)
}

const matchesErrorContext = createContext<boolean>(false);
export function useMatchesError() {
    return useContext(matchesErrorContext);
}

// ADD MATCH CONTEXTS


export default function MatchesProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [matchesReady, setMatchesReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const matches: MatchesDelegate = async (past: boolean) => {
        const arg = past ? "?before=" : "?after="
        const today = new Date()
        const date = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear()

        const data = await fetch("/api/match" + arg + date, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('error' in json_data) {
            setError(true)
            setMatchesReady(true)
            return json_data as errorResponse
        }
        else {
            setError(false);
            setMatchesReady(true);
            return json_data as MatchDTO[];
        }
    }

    return (
        <matchesContext.Provider value={matches}>
            <matchesErrorContext.Provider value={error}>
                <matchesReadyContext.Provider value={matchesReady}>
                    {props.children}
                </matchesReadyContext.Provider>
            </matchesErrorContext.Provider>
        </matchesContext.Provider>
    )
}