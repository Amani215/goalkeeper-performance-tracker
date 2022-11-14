import React from 'react';
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO } from '../DTOs';
import { MatchDTO } from '../DTOs/MatchDTO';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
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

// ADD GOALKEEPER CONTEXT

// DELETE GOALKEEPER CONTEXT


// PROVIDER
export default function MatchProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState(false)
    const [matchReady, setMatchReady] = useState<boolean>(false)
    const [matchPerformancesReady, setMatchPerformancesReady] = useState<boolean>(false)

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

    type contextProvider = {
        ctx: React.Context<any>,
        value: any
    }
    const providers: contextProvider[] = [
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