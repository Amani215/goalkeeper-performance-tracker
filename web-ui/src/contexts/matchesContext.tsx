import { createContext, PropsWithChildren, useContext, useState } from "react";
import { MatchDTO, NewMatchDTO } from "../DTOs/MatchDTO";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";
import { useTranslation } from "react-i18next";

// GET MATCHES CONTEXT
type MatchesDelegate = () => Promise<MatchDTO[] | errorResponse>;
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

// DELETE MATCH CONTEXTS
type DeleteMatchDelegate = (matchID: string) => Promise<null>;
const deleteMatchContext = createContext<DeleteMatchDelegate | null>(null);
export function useDeleteMatch() {
    return useContext(deleteMatchContext);
}

const matchDeletedContext = createContext<boolean>(false);
export function useMatchDeleted() {
    return useContext(matchDeletedContext);
}

const deleteMatchErrorContext = createContext<string>("");
export function useDeleteMatchError() {
    return useContext(deleteMatchErrorContext);
}

export default function MatchesProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [newMatchError, setNewMatchError] = useState(false)
    const [newMatchAdded, setNewMatchAdded] = useState(false)
    const [matchesReady, setMatchesReady] = useState<boolean>(false)

    const [matchDeleted, setMatchDeleted] = useState(false)
    const [deleteMatchError, setDeleteMatchError] = useState("")

    const { t } = useTranslation();
    const auth = useAuth()
    const token = auth?.token

    const matches: MatchesDelegate = async () => {
        setNewMatchAdded(false)

        const data = await fetch("/api/match", {
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

    const deleteMatch: DeleteMatchDelegate = async (matchID: string) => {
        setDeleteMatchError("")
        return fetch("/api/match?id=" + matchID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({})
        })
            .then(data => {
                if (data.status == 204) {
                    setMatchDeleted(true)
                } else {
                    setMatchDeleted(false)
                    if (data.status == 401) {
                        setDeleteMatchError(`${t("match_connected_error")}`)
                    }
                }
                return null
            })
    }

    return (
        <matchesContext.Provider value={matches}>
            <matchesErrorContext.Provider value={error}>
                <matchesReadyContext.Provider value={matchesReady}>
                    <newMatchContext.Provider value={newMatch}>
                        <matchAddedContext.Provider value={newMatchAdded}>
                            <newMatchErrorContext.Provider value={newMatchError}>
                                <deleteMatchContext.Provider value={deleteMatch}>
                                    <matchDeletedContext.Provider value={matchDeleted}>
                                        <deleteMatchErrorContext.Provider value={deleteMatchError}>
                                            {props.children}
                                        </deleteMatchErrorContext.Provider>
                                    </matchDeletedContext.Provider>
                                </deleteMatchContext.Provider>
                            </newMatchErrorContext.Provider>
                        </matchAddedContext.Provider>
                    </newMatchContext.Provider>
                </matchesReadyContext.Provider>
            </matchesErrorContext.Provider>
        </matchesContext.Provider>
    )
}