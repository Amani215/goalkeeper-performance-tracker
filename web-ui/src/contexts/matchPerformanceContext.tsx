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

// PROVIDER
export default function MatchPerformanceProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [matchPerformance, setMatchPerformance] = useState<MatchMonitoringDTO | null>(null)
    const [matchPerformanceReady, setMatchPerformanceReady] = useState<boolean>(false)

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

    return (
        <getMatchPerformanceContext.Provider value={getMatchPerformance}>
            <matchPerformanceContext.Provider value={matchPerformance}>
                <matchPerformanceErrorContext.Provider value={error}>
                    <matchPerformanceReadyContext.Provider value={matchPerformanceReady}>
                        {props.children}
                    </matchPerformanceReadyContext.Provider>
                </matchPerformanceErrorContext.Provider>
            </matchPerformanceContext.Provider>
        </getMatchPerformanceContext.Provider>
    )
}