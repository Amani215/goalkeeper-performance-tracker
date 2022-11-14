import React from 'react';
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO } from '../DTOs';
import { MatchDTO } from '../DTOs/MatchDTO';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';


// GET MATCH CONTEXTS
type MatchDelegate = (id: string) => Promise<MatchDTO | errorResponse>;
const getMatchContext = createContext<MatchDelegate | null>(null);
export function useGetMatch() {
    return useContext(getMatchContext);
}

const matchContext = createContext<MatchDTO | null>(null)
export function useMatch() {
    return useContext(matchContext)
}

const matchErrorContext = createContext<boolean>(false);
export function useMatchError() {
    return useContext(matchErrorContext);
}

const matchReadyContext = createContext<boolean>(false);
export function useMatchReady() {
    return useContext(matchReadyContext);
}

// GET MATCH CATEGORY CONTEXT
type MatchCategoryDelegate = (id: string) => Promise<CategoryDTO | null>;
const matchCategoryContext = createContext<MatchCategoryDelegate | null>(null);
export function useMatchCategory() {
    return useContext(matchCategoryContext);
}

// GET GOALKEEPERS PERFORMANCES CONTEXT
type MatchPerformancesDelegate = (id: string) => Promise<MatchMonitoringDTO[] | null>;
const matchPerformancesContext = createContext<MatchPerformancesDelegate | null>(null);
export function useMatchPerformances() {
    return useContext(matchPerformancesContext);
}

const matchPerformancesReadyContext = createContext<boolean>(false);
export function useMatchPerformancesReady() {
    return useContext(matchPerformancesReadyContext);
}

// UPDATE SCORES CONTEXT
type UpdateScoresDelegate = (id: string, localScore: number, visitorScore: number) => Promise<MatchDTO | errorResponse>;
const updateScoresContext = createContext<UpdateScoresDelegate | null>(null);
export function useUpdateScores() {
    return useContext(updateScoresContext);
}

const matchUpdatedContext = createContext<boolean>(false);
export function useMatchUpdated() {
    return useContext(matchUpdatedContext);
}

// ADD GOALKEEPER CONTEXT

// DELETE GOALKEEPER CONTEXT


// PROVIDER
export default function MatchProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState(false)
    const [matchReady, setMatchReady] = useState<boolean>(false)
    const [matchUpdated, setMatchUpdated] = useState<boolean>(false)
    const [matchPerformancesReady, setMatchPerformancesReady] = useState<boolean>(false)
    const [match, setMatch] = useState<MatchDTO | null>(null)

    const auth = useAuth()
    const token = auth?.token

    const getMatch: MatchDelegate = async (id: string) => {
        setMatchUpdated(false)
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
            setMatch(json_data as MatchDTO)
            return json_data as MatchDTO;
        }
        else {
            setError(true);
            setMatchReady(true);
            setMatch(null)
            return json_data as errorResponse;
        }
    }

    const matchCategory: MatchCategoryDelegate = async (id: string) => {
        const data = await fetch("/api/match/category?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setError(false);
            return json_data as CategoryDTO;
        }
        else {
            setError(true);
            return null;
        }
    }

    const matchPerformances: MatchPerformancesDelegate = async (id: string) => {
        const data = await fetch("/api/match/performances?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('error' in json_data) {
            setError(true);
            setMatchPerformancesReady(true)
            return null;
        }
        else {
            setError(false);
            setMatchPerformancesReady(true)
            return json_data as MatchMonitoringDTO[];
        }
    }

    const updateScores: UpdateScoresDelegate = async (id: string, localScore: number, visitorScore: number) => {
        const data = await fetch("/api/match/score?id=" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                score_local: Number(localScore),
                score_visitor: Number(visitorScore)
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setMatchReady(true);
            setError(false);
            setMatch(json_data as MatchDTO)
            setMatchUpdated(true)
            return json_data as MatchDTO;
        }
        else {
            setError(true);
            setMatchReady(true);
            setMatch(null)
            return json_data as errorResponse;
        }
    }

    type contextProvider = {
        ctx: React.Context<any>,
        value: any
    }
    const providers: contextProvider[] = [
        {
            ctx: getMatchContext,
            value: getMatch
        },
        {
            ctx: matchContext,
            value: match
        },
        {
            ctx: matchReadyContext,
            value: matchReady
        },
        {
            ctx: matchErrorContext,
            value: error
        },
        {
            ctx: matchCategoryContext,
            value: matchCategory
        },
        {
            ctx: matchPerformancesContext,
            value: matchPerformances
        },
        {
            ctx: matchPerformancesReadyContext,
            value: matchPerformancesReady
        },
        {
            ctx: updateScoresContext,
            value: updateScores
        },
        {
            ctx: matchUpdatedContext,
            value: matchUpdated
        },
    ]

    return (
        <>
            {providers.reduce(
                (Ctx1: React.ReactNode, Ctx2: contextProvider) => React.createElement(Ctx2.ctx.Provider, {
                    value: Ctx2.value
                }, Ctx1)
                , props.children)}
        </>)
}