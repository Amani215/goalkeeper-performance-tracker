import React, { createContext, PropsWithChildren, useContext, useState } from 'react'
import { MatchMonitoringDTO, UpdateMatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import { MatchSequenceDTO, NewMatchSequenceDTO } from '../DTOs/MatchSequenceDTO';

// GET MATCH PERFORMANCE CONTEXTS
type MatchPerformanceDelegate = (id: string) => Promise<MatchMonitoringDTO | errorResponse>;
const getMatchPerformanceContext = createContext<MatchPerformanceDelegate | null>(null);
export function useGetMatchPerformance() {
    return useContext(getMatchPerformanceContext);
}

const matchPerformanceContext = createContext<MatchMonitoringDTO | null>(null)
export function useMatchPerformance() {
    return useContext(matchPerformanceContext);
}

const matchPerformanceErrorContext = createContext<boolean>(false);
export function useMatchPerformanceError() {
    return useContext(matchPerformanceErrorContext);
}

const matchPerformanceReadyContext = createContext<boolean>(false);
export function useMatchPerformanceReady() {
    return useContext(matchPerformanceReadyContext);
}

// UPDATE MATCH PERFORMANCE CONTEXTS
type UpdateMatchPerformanceDelegate = (newMatchMonitoring: UpdateMatchMonitoringDTO) => Promise<MatchMonitoringDTO | errorResponse>;
const updateMatchPerformanceContext = createContext<UpdateMatchPerformanceDelegate | null>(null);
export function useUpdateMatchPerformance() {
    return useContext(updateMatchPerformanceContext);
}

const matchPerformanceUpdatedContext = createContext<boolean>(false);
export function useMatchPerformanceUpdated() {
    return useContext(matchPerformanceUpdatedContext);
}

// ADD MATCH SEQUENCE
type NewMatchSequencesDelegate = (id: string) => Promise<null>;
const addMatchSequenceContext = createContext<NewMatchSequencesDelegate | null>(null);
export function useAddMatchSequences() {
    return useContext(addMatchSequenceContext);
}

// GET MATCH SEQUENCES
type MatchSequencesDelegate = (id: string) => Promise<MatchSequenceDTO[] | errorResponse>;
const getMatchSequencesContext = createContext<MatchSequencesDelegate | null>(null);
export function useGetMatchSequences() {
    return useContext(getMatchSequencesContext);
}

const matchSequencesContext = createContext<MatchSequenceDTO[] | null>(null)
export function useMatchSequences() {
    return useContext(matchSequencesContext);
}

const matchSequencesReadyContext = createContext<boolean>(false);
export function useMatchSequencesReady() {
    return useContext(matchSequencesReadyContext);
}

// UPDATE MATCH SEQUENCE
type UpdateMatchSequenceDelegate = (matchSequence: NewMatchSequenceDTO) => Promise<MatchSequenceDTO | errorResponse>;
const updateMatchSequenceContext = createContext<UpdateMatchSequenceDelegate | null>(null);
export function useUpdateMatchSequence() {
    return useContext(updateMatchSequenceContext);
}

// DELETE MATCH SEQUENCE
type DeleteMatchSequencesDelegate = (id: string) => Promise<null>;
const deleteMatchSequenceContext = createContext<DeleteMatchSequencesDelegate | null>(null);
export function useDeleteMatchSequence() {
    return useContext(deleteMatchSequenceContext);
}

const matchSequencesUpdatedContext = createContext<boolean>(false);
export function useMatchSequencesUpdated() {
    return useContext(matchSequencesUpdatedContext);
}

// PROVIDER
export default function MatchPerformanceProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [matchPerformance, setMatchPerformance] = useState<MatchMonitoringDTO | null>(null)
    const [matchSequences, setMatchSequences] = useState<MatchSequenceDTO[] | null>(null)
    const [matchPerformanceReady, setMatchPerformanceReady] = useState<boolean>(false)
    const [matchPerformanceUpdated, setMatchPerformanceUpdated] = useState<boolean>(false)

    const [sequencesUpdated, setSequencesUpdated] = useState<boolean>(false)
    const [sequencesReady, setSequencesReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const getMatchPerformance: MatchPerformanceDelegate = async (id: string) => {
        const data = await fetch("/api/match_monitoring?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setMatchPerformanceReady(true);
            setMatchPerformance(json_data as MatchMonitoringDTO)
            setError(false);
            return json_data as MatchMonitoringDTO;
        }
        else {
            setError(true);
            setMatchPerformanceReady(true);
            setMatchPerformance(null)
            return json_data as errorResponse;
        }
    }

    const updateMatchPerformance: UpdateMatchPerformanceDelegate = async (newMatchMonitoring: UpdateMatchMonitoringDTO) => {
        const data = await fetch("/api/match_monitoring?id=" + newMatchMonitoring.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                goalkeeper_order: Number(newMatchMonitoring.goalkeeper_order),
                time_played: Number(newMatchMonitoring.time_played),
                goals_scored: Number(newMatchMonitoring.goals_scored),
                goals_conceded: Number(newMatchMonitoring.goals_conceded),
                penalties_saved: Number(newMatchMonitoring.penalties_saved),
                penalties_non_saved: Number(newMatchMonitoring.penalties_non_saved),
                balls_touched: Number(newMatchMonitoring.balls_touched),
                non_successful_ballon_profondeur: Number(newMatchMonitoring.non_successful_ballon_profondeur),
                non_successful_deliveries: Number(newMatchMonitoring.non_successful_deliveries),
                non_successful_foot_relaunch: Number(newMatchMonitoring.non_successful_foot_relaunch),
                non_successful_hand_relaunch: Number(newMatchMonitoring.non_successful_hand_relaunch),
                successful_ballon_profondeur: Number(newMatchMonitoring.successful_ballon_profondeur),
                successful_deliveries: Number(newMatchMonitoring.successful_deliveries),
                successful_foot_relaunch: Number(newMatchMonitoring.successful_foot_relaunch),
                successful_hand_relaunch: Number(newMatchMonitoring.successful_hand_relaunch),
                yellow_cards: Number(newMatchMonitoring.yellow_cards),
                red_cards: Number(newMatchMonitoring.red_cards),
                grade: Number(newMatchMonitoring.grade),
                comment: newMatchMonitoring.comment
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setMatchPerformanceReady(true);
            setError(false);
            setMatchPerformance(json_data)
            setMatchPerformanceUpdated(true)
            return json_data as MatchMonitoringDTO;
        }
        else {
            setError(true);
            setMatchPerformanceReady(true);
            setMatchPerformance(null)
            return json_data as errorResponse;
        }
    }

    const addSequence: NewMatchSequencesDelegate = async (id: string) => {
        setError(false)
        return fetch("/api/match_sequence", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                'match_performance_id': id
            })
        })
            .then(data => {
                if (data.status == 201) {
                    setSequencesUpdated(true)
                } else {
                    setSequencesUpdated(false)
                    setError(true)
                }
                return null
            })
    }

    const updateSequence: UpdateMatchSequenceDelegate = async (matchSequence: NewMatchSequenceDTO) => {
        const data = await fetch("/api/match_sequence?id=" + matchSequence.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                'sequence_number': matchSequence.sequence_number,
                'action_type': matchSequence.action_type,
                'reaction_type': matchSequence.reaction_type,
                'action_result': matchSequence.action_result,
                'comment': matchSequence.comment
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setError(false);
            setSequencesUpdated(true);
            return json_data as MatchSequenceDTO;
        }
        else {
            setError(true);
            setSequencesUpdated(false);
            return json_data as errorResponse;
        }
    }

    const getMatchSequences: MatchSequencesDelegate = async (id: string) => {
        setSequencesReady(false);
        id = matchPerformance ? matchPerformance.id : ""
        const data = await fetch("/api/match_sequence?mmid=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('error' in json_data) {
            setError(true);
            setMatchSequences(null)
            setSequencesUpdated(false)
            return json_data as errorResponse;
        }
        else {
            setError(false);
            setSequencesReady(true);
            setSequencesUpdated(false)
            setMatchSequences(json_data as MatchSequenceDTO[])
            return json_data as MatchSequenceDTO[];
        }
    }

    const deleteSequence: DeleteMatchSequencesDelegate = async (id: string) => {
        setError(false)
        return fetch("/api/match_sequence?id=" + id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => {
                if (data.status == 204) {
                    setSequencesUpdated(true)
                } else {
                    setSequencesUpdated(false)
                    setError(true)
                }
                return null
            })
    }

    type contextProvider = {
        ctx: React.Context<any>,
        value: any
    }
    const providers: contextProvider[] = [
        {
            ctx: getMatchPerformanceContext,
            value: getMatchPerformance
        },
        {
            ctx: matchPerformanceContext,
            value: matchPerformance
        },
        {
            ctx: matchPerformanceErrorContext,
            value: error
        },
        {
            ctx: matchPerformanceReadyContext,
            value: matchPerformanceReady
        },
        {
            ctx: updateMatchPerformanceContext,
            value: updateMatchPerformance
        },
        {
            ctx: matchPerformanceUpdatedContext,
            value: matchPerformanceUpdated
        },
        {
            ctx: getMatchSequencesContext,
            value: getMatchSequences
        },
        {
            ctx: addMatchSequenceContext,
            value: addSequence
        },
        {
            ctx: updateMatchSequenceContext,
            value: updateSequence
        },
        {
            ctx: matchSequencesContext,
            value: matchSequences
        },
        {
            ctx: matchSequencesReadyContext,
            value: sequencesReady
        },
        {
            ctx: deleteMatchSequenceContext,
            value: deleteSequence
        },
        {
            ctx: matchSequencesUpdatedContext,
            value: sequencesUpdated
        }
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