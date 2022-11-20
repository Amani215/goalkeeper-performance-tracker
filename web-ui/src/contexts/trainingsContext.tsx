import { createContext, PropsWithChildren, useContext, useState } from "react";
import { MatchDTO, NewMatchDTO } from "../DTOs/MatchDTO";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";
import { TrainingDTO } from "../DTOs/TrainingDTO"

// ADD TRAINING CONTEXTS
type NewTraininghDelegate = (date: string, duration: number, category_id: string) => Promise<TrainingDTO | errorResponse>;
const newTrainingContext = createContext<NewTraininghDelegate | null>(null);
export function useNewTraining() {
    return useContext(newTrainingContext);
}

const newTrainingErrorContext = createContext<boolean>(false);
export function useNewTrainingError() {
    return useContext(newTrainingErrorContext);
}

export default function TrainingsProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)

    const auth = useAuth()
    const token = auth?.token

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
                    return data as errorResponse
                } else {
                    setError(false)
                    return data as TrainingDTO
                }
            })
    }


    return (
        <newTrainingContext.Provider value={newTraining}>
            <newTrainingErrorContext.Provider value={error}>
                {props.children}
            </newTrainingErrorContext.Provider>
        </newTrainingContext.Provider>
    )
}