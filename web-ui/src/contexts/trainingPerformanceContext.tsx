import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { TrainingMonitoringDTO, UpdateTrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO';
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

// UPDATE TRAINING PERFORMANCE CONTEXTS
type UpdateTrainingPerformanceDelegate = (newTrainingMonitoring: UpdateTrainingMonitoringDTO) => Promise<TrainingMonitoringDTO | errorResponse>;
const updateTrainingPerformanceContext = createContext<UpdateTrainingPerformanceDelegate | null>(null);
export function useUpdateTrainingPerformance() {
    return useContext(updateTrainingPerformanceContext);
}

const trainingPerformanceUpdatedContext = createContext<boolean>(false);
export function useTrainingPerformanceUpdated() {
    return useContext(trainingPerformanceUpdatedContext);
}

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

    const updateTrainingPerformance: UpdateTrainingPerformanceDelegate = async (newTrainingMonitoring: UpdateTrainingMonitoringDTO) => {
        const data = await fetch("/api/training_monitoring?id=" + newTrainingMonitoring.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                attendance: newTrainingMonitoring.attendance
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setTrainingPerformanceReady(true);
            setError(false);
            setTrainingPerformance(json_data)
            setTrainingPerformanceUpdated(true)
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
                        <updateTrainingPerformanceContext.Provider value={updateTrainingPerformance}>
                            <trainingPerformanceUpdatedContext.Provider value={trainingPerformanceUpdated}>
                                {props.children}
                            </trainingPerformanceUpdatedContext.Provider>
                        </updateTrainingPerformanceContext.Provider>
                    </trainingPerformanceReadyContext.Provider>
                </trainingPerformanceErrorContext.Provider>
            </trainingPerformanceContext.Provider>
        </getTrainingPerformanceContext.Provider>
    )
}