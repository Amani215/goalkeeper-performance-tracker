import { createContext, PropsWithChildren, useContext, useState } from "react";
import { MatchDTO, NewMatchDTO } from "../DTOs/MatchDTO";
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
type NewMatchDelegate = (newMatchObj: NewMatchDTO) => Promise<MatchDTO | errorResponse>;
const newMatchContext = createContext<NewMatchDelegate | null>(null);
export function useNewMatch() {
    return useContext(newMatchContext);
}

const matchAddedContext = createContext<boolean>(false);
export function useMatchAdded() {
    return useContext(matchAddedContext);
}

const newMatchErrorContext = createContext<boolean>(false);
export function useNewMatchError() {
    return useContext(newMatchErrorContext);
}

export default function MatchesProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [newMatchError, setNewMatchError] = useState(false)
    const [newMatchAdded, setNewMatchAdded] = useState(false)
    const [matchesReady, setMatchesReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const matches: MatchesDelegate = async (past: boolean) => {
        setNewMatchAdded(false)

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

    const newMatch: NewMatchDelegate = (newMatchObj: NewMatchDTO) => {
        return fetch("/api/match", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                date: newMatchObj.date,
                local: newMatchObj.local,
                visitor: newMatchObj.visitor,
                match_type: newMatchObj.match_type,
                category_id: newMatchObj.category_id
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setNewMatchError(true)
                    return data as errorResponse
                } else {
                    setNewMatchError(false)
                    setNewMatchAdded(true)
                    return data as MatchDTO
                }
            })
    }


    return (
        <matchesContext.Provider value={matches}>
            <matchesErrorContext.Provider value={error}>
                <matchesReadyContext.Provider value={matchesReady}>
                    <newMatchContext.Provider value={newMatch}>
                        <matchAddedContext.Provider value={newMatchAdded}>
                            <newMatchErrorContext.Provider value={newMatchError}>
                                {props.children}
                            </newMatchErrorContext.Provider>
                        </matchAddedContext.Provider>
                    </newMatchContext.Provider>
                </matchesReadyContext.Provider>
            </matchesErrorContext.Provider>
        </matchesContext.Provider>
    )
}