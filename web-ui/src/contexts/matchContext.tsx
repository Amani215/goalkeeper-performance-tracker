import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { MatchDTO, NewMatchDTO } from '../DTOs/MatchDTO';
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

// UPDATE MATCH CONTEXT
type UpdateMatchDelegate = (id: string, newMatchObj: NewMatchDTO) => Promise<MatchDTO | errorResponse>;
const updateMatchContext = createContext<UpdateMatchDelegate | null>(null);
export function useUpdateMatch() {
    return useContext(updateMatchContext);
}

// ADD GOALKEEPER CONTEXT
type NewMatchGoalkeeperDelegate = (goalkeeperId: string, matchId: string) => Promise<MatchMonitoringDTO | errorResponse>;
const newMatchGoalkeeperContext = createContext<NewMatchGoalkeeperDelegate | null>(null);
export function useNewMatchGoalkeeper() {
    return useContext(newMatchGoalkeeperContext);
}

const matchGoalkeepersUpdatedContext = createContext<boolean>(false);
export function useMatchGoalkeepersUpdated() {
    return useContext(matchGoalkeepersUpdatedContext);
}

// DELETE GOALKEEPER CONTEXT
type DeleteMatchGoalkeeperDelegate = (goalkeeperPerformanceId: string, matchId: string) => Promise<null | errorResponse>;
const deleteMatchGoalkeeperContext = createContext<DeleteMatchGoalkeeperDelegate | null>(null);
export function useDeleteMatchGoalkeeper() {
    return useContext(deleteMatchGoalkeeperContext);
}

// PROVIDER
export default function MatchProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState(false)
    const [matchReady, setMatchReady] = useState<boolean>(false)
    const [matchUpdated, setMatchUpdated] = useState<boolean>(false)
    const [matchPerformancesReady, setMatchPerformancesReady] = useState<boolean>(false)
    const [matchPerformancesUpdated, setMatchPerformancesUpdated] = useState<boolean>(false)
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

    const matchPerformances: MatchPerformancesDelegate = async (id: string) => {
        setMatchPerformancesUpdated(false)
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

    // adding a goalkeeper is equivalent to adding a match performance object
    const newMatchPerformance: NewMatchGoalkeeperDelegate = async (goalkeeperId: string, matchId: string) => {
        const data = await fetch("/api/match_monitoring", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                goalkeeper_id: goalkeeperId,
                match_id: matchId
            })
        });
        const data_json = await data.json();
        if ("error" in data_json) {
            setError(true);
            setMatchPerformancesUpdated(false);
            return data_json as errorResponse;
        } else {
            setMatchPerformancesUpdated(true);
            return data_json as MatchMonitoringDTO;
        }
    }

    // deleting a goalkeeper is equivalent to deleting a match performance object
    const deleteMatchPerformance: DeleteMatchGoalkeeperDelegate = async (goalkeeperPerformanceId: string, matchId: string) => {
        const data = await fetch("/api/match/performances?id=" + matchId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                goalkeeper_performance_id: goalkeeperPerformanceId
            })
        });
        if (data.status == 204) {
            setMatchPerformancesUpdated(true);
            return null;
        }
        const data_json = await data.json();
        setError(true);
        setMatchPerformancesUpdated(false);
        return data_json as errorResponse;
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

    const updateMatch: UpdateMatchDelegate = async (id: string, newMatchObj: NewMatchDTO) => {
        const data = await fetch("/api/match", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                match_id: id,
                category_id: newMatchObj.category_id,
                local: newMatchObj.local,
                visitor: newMatchObj.visitor,
                date: newMatchObj.date,
                match_type: newMatchObj.match_type
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setMatchUpdated(true)
            setMatchReady(true);
            setError(false);
            setMatch(json_data as MatchDTO)
            return json_data as MatchDTO;
        }
        else {
            setMatchUpdated(false)
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
            ctx: updateMatchContext,
            value: updateMatch
        },
        {
            ctx: matchUpdatedContext,
            value: matchUpdated
        },
        {
            ctx: newMatchGoalkeeperContext,
            value: newMatchPerformance
        },
        {
            ctx: deleteMatchGoalkeeperContext,
            value: deleteMatchPerformance
        },
        {
            ctx: matchGoalkeepersUpdatedContext,
            value: matchPerformancesUpdated
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