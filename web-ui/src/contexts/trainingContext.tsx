import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { TrainingDTO } from '../DTOs/TrainingDTO';
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';


// GET TRAINING CONTEXTS
type TrainingDelegate = (id: string) => Promise<TrainingDTO | errorResponse>;
const getTrainingContext = createContext<TrainingDelegate | null>(null);
export function useGetTraining() {
    return useContext(getTrainingContext);
}

const trainingContext = createContext<TrainingDTO | null>(null)
export function useTraining() {
    return useContext(trainingContext)
}

const trainingErrorContext = createContext<boolean>(false);
export function useTrainingError() {
    return useContext(trainingErrorContext);
}

const trainingReadyContext = createContext<boolean>(false);
export function useTrainingReady() {
    return useContext(trainingReadyContext);
}

// GET GOALKEEPERS PERFORMANCES CONTEXT
type TrainingPerformancesDelegate = (id: string) => Promise<TrainingMonitoringDTO[] | null>;
const trainingPerformancesContext = createContext<TrainingPerformancesDelegate | null>(null);
export function useTrainingPerformances() {
    return useContext(trainingPerformancesContext);
}

const trainingPerformancesReadyContext = createContext<boolean>(false);
export function useTrainingPerformancesReady() {
    return useContext(trainingPerformancesReadyContext);
}

// ADD GOALKEEPER CONTEXT
type NewTrainingGoalkeeperDelegate = (goalkeeperId: string, sessionId: string) => Promise<TrainingMonitoringDTO | errorResponse>;
const newTrainingGoalkeeperContext = createContext<NewTrainingGoalkeeperDelegate | null>(null);
export function useNewTrainingGoalkeeper() {
    return useContext(newTrainingGoalkeeperContext);
}

const trainingGoalkeepersUpdatedContext = createContext<boolean>(false);
export function useTrainingGoalkeepersUpdated() {
    return useContext(trainingGoalkeepersUpdatedContext);
}

// DELETE GOALKEEPER CONTEXT
type DeleteTrainingGoalkeeperDelegate = (goalkeeperPerformanceId: string, sessionId: string) => Promise<null | errorResponse>;
const deleteTrainingGoalkeeperContext = createContext<DeleteTrainingGoalkeeperDelegate | null>(null);
export function useDeleteTrainingGoalkeeper() {
    return useContext(deleteTrainingGoalkeeperContext);
}

// UPDATE TRAINING FORM CONTEXT
type FileDelegate = (id: string, formdata: FormData) => Promise<string | errorResponse>;
const updateTrainingFormContext = createContext<FileDelegate | null>(null);
export function useUpdateTrainingForm() {
    return useContext(updateTrainingFormContext);
}

// PROVIDER
export default function TrainingProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState(false)
    const [trainingReady, setTrainingReady] = useState<boolean>(false)
    const [training, setTraining] = useState<TrainingDTO | null>(null)
    const [trainingPerformancesReady, setTrainingPerformancesReady] = useState<boolean>(false)
    const [trainingPerformancesUpdated, setTrainingPerformancesUpdated] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const getTraining: TrainingDelegate = async (id: string) => {
        const data = await fetch("/api/training_session?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('error' in json_data) {
            setError(true);
            setTrainingReady(true);
            setTraining(null)
            return json_data as errorResponse;
        }
        else {
            setTrainingReady(true);
            setError(false);
            setTraining(json_data as TrainingDTO)
            return json_data as TrainingDTO;
        }
    }

    const trainingPerformances: TrainingPerformancesDelegate = async (id: string) => {
        setTrainingPerformancesUpdated(false)
        const data = await fetch("/api/training_session/performances?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('error' in json_data) {
            setError(true);
            setTrainingPerformancesReady(true)
            return null;
        }
        else {
            setError(false);
            setTrainingPerformancesReady(true)
            return json_data as TrainingMonitoringDTO[];
        }
    }

    const newTrainingPerformance: NewTrainingGoalkeeperDelegate = async (goalkeeperId: string, sessionId: string) => {
        const data = await fetch("/api/training_monitoring", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                goalkeeper_id: goalkeeperId,
                session_id: sessionId
            })
        });
        const data_json = await data.json();
        if ("error" in data_json) {
            setError(true);
            setTrainingPerformancesUpdated(false);
            return data_json as errorResponse;
        } else {
            setTrainingPerformancesUpdated(true);
            return data_json as TrainingMonitoringDTO;
        }
    }

    const deleteTrainingPerformance: DeleteTrainingGoalkeeperDelegate = async (goalkeeperPerformanceId: string, sessionId: string) => {
        const data = await fetch("/api/training_session/performances?id=" + sessionId, {
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
            setTrainingPerformancesUpdated(true);
            return null;
        }
        const data_json = await data.json();
        setError(true);
        setTrainingPerformancesUpdated(false);
        return data_json as errorResponse;
    }

    const trainingForm: FileDelegate = (id: string, formdata: FormData) => {
        return fetch("/api/training_session/form?id=" + id, {
            method: "PUT",
            headers: {
                'Accept': '*/*',
                'Authorization': `bearer ${token}`
            },
            body: formdata
        })
            .then(data => data.json())
    }

    type contextProvider = {
        ctx: React.Context<any>,
        value: any
    }
    const providers: contextProvider[] = [
        {
            ctx: getTrainingContext,
            value: getTraining
        },
        {
            ctx: trainingContext,
            value: training
        },
        {
            ctx: trainingErrorContext,
            value: error
        },
        {
            ctx: trainingReadyContext,
            value: trainingReady
        },
        {
            ctx: trainingPerformancesContext,
            value: trainingPerformances
        },
        {
            ctx: trainingPerformancesReadyContext,
            value: trainingPerformancesReady
        },
        {
            ctx: newTrainingGoalkeeperContext,
            value: newTrainingPerformance
        },
        {
            ctx: trainingGoalkeepersUpdatedContext,
            value: trainingPerformancesUpdated
        },
        {
            ctx: deleteTrainingGoalkeeperContext,
            value: deleteTrainingPerformance
        },
        {
            ctx: updateTrainingFormContext,
            value: trainingForm
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