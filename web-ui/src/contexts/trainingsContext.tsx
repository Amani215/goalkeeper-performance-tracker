import { createContext, PropsWithChildren, useContext, useState } from "react";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";
import { TrainingDTO } from "../DTOs/TrainingDTO"
import { json } from "stream/consumers";
import { useTranslation } from "react-i18next";

// GET TRAININGS CONTEXT
type TrainingsDelegate = () => Promise<TrainingDTO[] | errorResponse>;
const trainingsContext = createContext<TrainingsDelegate | null>(null);
export function useTrainings() {
    return useContext(trainingsContext);
}

const trainingsReadyContext = createContext<boolean>(false)
export function useTrainingsReady() {
    return useContext(trainingsReadyContext)
}

// ADD TRAINING CONTEXTS
type NewTraininghDelegate = (date: string, duration: number, category_id: string) => Promise<TrainingDTO | errorResponse>;
const newTrainingContext = createContext<NewTraininghDelegate | null>(null);
export function useNewTraining() {
    return useContext(newTrainingContext);
}

const trainingAddedContext = createContext<boolean>(false);
export function useTrainingAdded() {
    return useContext(trainingAddedContext);
}

const newTrainingErrorContext = createContext<boolean>(false);
export function useNewTrainingError() {
    return useContext(newTrainingErrorContext);
}

// DELETE MATCH CONTEXTS
type DeleteTrainingDelegate = (trainingID: string) => Promise<null>;
const deleteTrainingContext = createContext<DeleteTrainingDelegate | null>(null);
export function useDeletetraining() {
    return useContext(deleteTrainingContext);
}

const trainingDeletedContext = createContext<boolean>(false);
export function useTrainingDeleted() {
    return useContext(trainingDeletedContext);
}

const deleteTrainingErrorContext = createContext<string>("");
export function useDeleteTrainingError() {
    return useContext(deleteTrainingErrorContext);
}

export default function TrainingsProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [trainingAdded, setTrainingAdded] = useState(false)
    const [trainingsReady, setTrainingsReady] = useState<boolean>(false)
    const [trainingDeleted, setTrainingDeleted] = useState(false)
    const [deleteTrainingError, setDeleteTrainingError] = useState<string>("")

    const { t } = useTranslation();
    const auth = useAuth()
    const token = auth?.token

    const trainings: TrainingsDelegate = async () => {
        setTrainingAdded(false)
        setTrainingDeleted(false)

        const data = await fetch("/api/training_session", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('error' in json_data) {
            setError(true)
            setTrainingsReady(true)
            return json_data as errorResponse
        }
        else {
            setError(false);
            setTrainingsReady(true);
            return json_data as TrainingDTO[];
        }
    }

    const newTraining: NewTraininghDelegate = (date: string, duration: number, category_id: string) => {
        return fetch("/api/training_session", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                date: date,
                duration: duration,
                category_id: category_id
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setError(true)
                    setTrainingAdded(false)
                    return data as errorResponse
                } else {
                    setError(false)
                    setTrainingAdded(true)
                    return data as TrainingDTO
                }
            })
    }

    const deleteTraining: DeleteTrainingDelegate = async (trainingID: string) => {
        setDeleteTrainingError("")
        return fetch("/api/training_session?id=" + trainingID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({})
        })
            .then(data => {
                if (data.status == 204) {
                    setTrainingDeleted(true)
                } else {
                    setTrainingDeleted(false)
                    if (data.status == 401) {
                        setDeleteTrainingError(`${t("training_connected_error")}`)
                    }
                }
                return null
            })
    }

    return (
        <trainingsContext.Provider value={trainings}>
            <trainingsReadyContext.Provider value={trainingsReady}>
                <newTrainingContext.Provider value={newTraining}>
                    <trainingAddedContext.Provider value={trainingAdded}>
                        <newTrainingErrorContext.Provider value={error}>
                            <deleteTrainingContext.Provider value={deleteTraining}>
                                <trainingDeletedContext.Provider value={trainingDeleted}>
                                    <deleteTrainingErrorContext.Provider value={deleteTrainingError}>
                                        {props.children}
                                    </deleteTrainingErrorContext.Provider>
                                </trainingDeletedContext.Provider>
                            </deleteTrainingContext.Provider>
                        </newTrainingErrorContext.Provider>
                    </trainingAddedContext.Provider>
                </newTrainingContext.Provider>
            </trainingsReadyContext.Provider>
        </trainingsContext.Provider>
    )
}