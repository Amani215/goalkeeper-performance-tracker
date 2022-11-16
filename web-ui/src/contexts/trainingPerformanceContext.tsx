import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import React from 'react'

// GET TRAINING PERFORMANCE CONTEXTS
type TrainingPerformanceDelegate = (id: string) => Promise<TrainingMonitoringDTO | errorResponse>;
const getTrainingPerformanceContext = createContext<TrainingPerformanceDelegate | null>(null);
export function useGetTrainingPerformance() {
    return useContext(getTrainingPerformanceContext);
}

const trainingPerformanceContext = createContext<TrainingMonitoringDTO | null>(null)
export function useTrainingPerformance() {
    return useContext(trainingPerformanceContext);
}

const trainingPerformanceErrorContext = createContext<boolean>(false);
export function useTrainingPerformanceError() {
    return useContext(trainingPerformanceErrorContext);
}

const trainingPerformanceReadyContext = createContext<boolean>(false);
export function useTrainingPerformanceReady() {
    return useContext(trainingPerformanceReadyContext);
}

// UPDATE MATCH PERFORMANCE CONTEXTS


// PROVIDER
export default function TrainingPerformanceProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [trainingPerformance, setTrainingPerformance] = useState<TrainingMonitoringDTO | null>(null)
    const [trainingPerformanceReady, setTrainingPerformanceReady] = useState<boolean>(false)
    const [trainingPerformanceUpdated, setTrainingPerformanceUpdated] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const getTrainingPerformance: TrainingPerformanceDelegate = async (id: string) => {
        const data = await fetch("/api/training_monitoring?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setTrainingPerformanceReady(true);
            setTrainingPerformance(json_data as TrainingMonitoringDTO)
            setError(false);
            return json_data as TrainingMonitoringDTO;
        }
        else {
            setError(true);
            setTrainingPerformanceReady(true);
            setTrainingPerformance(null)
            return json_data as errorResponse;
        }
    }


    return (
        <getTrainingPerformanceContext.Provider value={getTrainingPerformance}>
            <trainingPerformanceContext.Provider value={trainingPerformance}>
                <trainingPerformanceErrorContext.Provider value={error}>
                    <trainingPerformanceReadyContext.Provider value={trainingPerformanceReady}>
                        {props.children}
                    </trainingPerformanceReadyContext.Provider>
                </trainingPerformanceErrorContext.Provider>
            </trainingPerformanceContext.Provider>
        </getTrainingPerformanceContext.Provider>
    )
}