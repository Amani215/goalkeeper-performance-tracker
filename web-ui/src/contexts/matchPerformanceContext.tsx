import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { MatchMonitoringDTO, UpdateMatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import { MatchSequenceDTO } from '../DTOs/MatchSequenceDTO';

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

// PROVIDER
export default function MatchPerformanceProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [matchPerformance, setMatchPerformance] = useState<MatchMonitoringDTO | null>(null)
    const [matchSequences, setMatchSequences] = useState<MatchSequenceDTO[] | null>(null)
    const [matchPerformanceReady, setMatchPerformanceReady] = useState<boolean>(false)
    const [matchPerformanceUpdated, setMatchPerformanceUpdated] = useState<boolean>(false)

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

    const getMatchSequences: MatchSequencesDelegate = async (id: string) => {
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
            return json_data as errorResponse;
        }
        else {
            setError(false);
            setMatchSequences(json_data as MatchSequenceDTO[])
            return json_data as MatchSequenceDTO[];
        }
    }

    return (
        <getMatchPerformanceContext.Provider value={getMatchPerformance}>
            <matchPerformanceContext.Provider value={matchPerformance}>
                <matchPerformanceErrorContext.Provider value={error}>
                    <matchPerformanceReadyContext.Provider value={matchPerformanceReady}>
                        <updateMatchPerformanceContext.Provider value={updateMatchPerformance}>
                            <matchPerformanceUpdatedContext.Provider value={matchPerformanceUpdated}>
                                <getMatchSequencesContext.Provider value={getMatchSequences}>
                                    <matchSequencesContext.Provider value={matchSequences}>
                                        {props.children}
                                    </matchSequencesContext.Provider>
                                </getMatchSequencesContext.Provider>
                            </matchPerformanceUpdatedContext.Provider>
                        </updateMatchPerformanceContext.Provider>
                    </matchPerformanceReadyContext.Provider>
                </matchPerformanceErrorContext.Provider>
            </matchPerformanceContext.Provider>
        </getMatchPerformanceContext.Provider>
    )
}