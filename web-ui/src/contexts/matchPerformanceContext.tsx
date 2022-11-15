import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';

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
type UpdateMatchPerformanceDelegate = (
    id: string,
    time_played: number,
    goals_scored: number,
    goals_conceded: number,
    penalties_saved: number,
    penalties_non_saved: number,
    yellow_cards: number,
    red_cards: number,
    grade: number,
    assets: string, flaws: string, comment: string) => Promise<MatchMonitoringDTO | errorResponse>;
const updateMatchPerformanceContext = createContext<UpdateMatchPerformanceDelegate | null>(null);
export function useUpdateMatchPerformance() {
    return useContext(updateMatchPerformanceContext);
}

const matchPerformanceUpdatedContext = createContext<boolean>(false);
export function useMatchPerformanceUpdated() {
    return useContext(matchPerformanceUpdatedContext);
}

// PROVIDER
export default function MatchPerformanceProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [matchPerformance, setMatchPerformance] = useState<MatchMonitoringDTO | null>(null)
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

    const updateMatchPerformance: UpdateMatchPerformanceDelegate = async (
        id: string,
        time_played: number,
        goals_scored: number,
        goals_conceded: number,
        penalties_saved: number,
        penalties_non_saved: number,
        yellow_cards: number,
        red_cards: number,
        grade: number,
        assets: string, flaws: string, comment: string) => {
        const data = await fetch("/api/match_monitoring?id=" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                time_played: Number(time_played),
                goals_scored: Number(goals_scored),
                goals_conceded: Number(goals_conceded),
                penalties_saved: Number(penalties_saved),
                penalties_non_saved: Number(penalties_non_saved),
                yellow_cards: Number(yellow_cards),
                red_cards: Number(red_cards),
                grade: Number(grade),
                assets: assets,
                flaws: flaws,
                comment: comment
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
    return (
        <getMatchPerformanceContext.Provider value={getMatchPerformance}>
            <matchPerformanceContext.Provider value={matchPerformance}>
                <matchPerformanceErrorContext.Provider value={error}>
                    <matchPerformanceReadyContext.Provider value={matchPerformanceReady}>
                        <updateMatchPerformanceContext.Provider value={updateMatchPerformance}>
                            <matchPerformanceUpdatedContext.Provider value={matchPerformanceUpdated}>
                                {props.children}
                            </matchPerformanceUpdatedContext.Provider>
                        </updateMatchPerformanceContext.Provider>
                    </matchPerformanceReadyContext.Provider>
                </matchPerformanceErrorContext.Provider>
            </matchPerformanceContext.Provider>
        </getMatchPerformanceContext.Provider>
    )
}