import React from 'react';
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { MatchDTO } from '../DTOs/MatchDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';


// GET MATCH CONTEXTS
type MatchDelegate = (id: string) => Promise<MatchDTO | errorResponse>;
const matchContext = createContext<MatchDelegate | null>(null);
export function useMatch() {
    return useContext(matchContext);
}

const matchErrorContext = createContext<boolean>(false);
export function useMatchError() {
    return useContext(matchErrorContext);
}

const matchReadyContext = createContext<boolean>(false);
export function useMatchReady() {
    return useContext(matchReadyContext);
}

// GET GOALKEEPERS CONTEXT

// ADD GOALKEEPER CONTEXT

// DELETE GOALKEEPER CONTEXT


// PROVIDER
export default function MatchProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState(false)
    const [matchReady, setMatchReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const match: MatchDelegate = async (id: string) => {
        const data = await fetch("/api/match?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setMatchReady(true);
            setError(false);
            return json_data as MatchDTO;
        }
        else {
            setError(true);
            setMatchReady(true);
            return json_data as errorResponse;
        }
    }

    return (
        <matchContext.Provider value={match}>
            <matchReadyContext.Provider value={matchReady}>
                <matchErrorContext.Provider value={error}>
                    {props.children}
                </matchErrorContext.Provider>
            </matchReadyContext.Provider>
        </matchContext.Provider>
    )
}