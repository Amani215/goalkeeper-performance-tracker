import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { TrainingDTO } from '../DTOs/TrainingDTO';
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


// ADD GOALKEEPER CONTEXT

// DELETE GOALKEEPER CONTEXT


// PROVIDER
export default function TrainingProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState(false)
    const [trainingReady, setTrainingReady] = useState<boolean>(false)
    const [training, setTraining] = useState<TrainingDTO | null>(null)

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
            ctx: trainingErrorContext,
            value: error
        },
        {
            ctx: trainingReadyContext,
            value: trainingReady
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