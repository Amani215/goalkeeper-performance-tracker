import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { GoalkeeperDTO, NewGoalkeeperDTO } from "../DTOs/GoalkeeperDTO";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";

// GET GOALKEEPERS CONTEXTS
const goalkeepersContext = createContext<GoalkeeperDTO[] | null>(null)
export function useGoalkeepers() {
    return useContext(goalkeepersContext)
}

const goalkeepersReadyContext = createContext<boolean>(false)
export function useGoalkeepersReady() {
    return useContext(goalkeepersReadyContext)
}

// ADD GOALKEEPER CONTEXTS
type NewGoalkeeperDelegate = (newGoalkeeperObj: NewGoalkeeperDTO) => Promise<GoalkeeperDTO | errorResponse>;
const newGoalkeeperContext = createContext<NewGoalkeeperDelegate | null>(null);
export function useNewGoalkeeper() {
    return useContext(newGoalkeeperContext);
}

const newGoalkeeperErrorContext = createContext<boolean>(false);
export function useNewGoalkeeperError() {
    return useContext(newGoalkeeperErrorContext);
}

export default function GoalkeepersProvider(props: PropsWithChildren<{}>) {
    const [goalkeepers, setGoalkeepers] = useState<GoalkeeperDTO[] | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

    const [newGoalkeeperError, setNewGoalkeeperError] = useState(false)

    const auth = useAuth()
    const token = auth?.token

    const getGoalkeepers = async () => {
        if (token) {
            await fetch("/api/goalkeeper", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`
                }
            })
                .then(data => data.json())
                .then((data) => {
                    const dataString = JSON.stringify(data)
                    const goalkeepersDTO: GoalkeeperDTO[] = JSON.parse(dataString)
                    setGoalkeepers(goalkeepersDTO)
                    setLoaded(true)
                })
        }

    }

    const newGoalkeeper: NewGoalkeeperDelegate = (newGoalkeeperObj: NewGoalkeeperDTO) => {
        return fetch("/api/goalkeeper", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                name: newGoalkeeperObj.name,
                day: newGoalkeeperObj.day,
                month: newGoalkeeperObj.month,
                year: newGoalkeeperObj.year
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setNewGoalkeeperError(true)
                    return data as errorResponse
                } else {
                    setNewGoalkeeperError(false)
                    setGoalkeepers([...goalkeepers as GoalkeeperDTO[], data as GoalkeeperDTO])
                    return data as GoalkeeperDTO
                }
            })
    }

    useEffect(() => {
        getGoalkeepers()
    }, [loaded, token])

    return (
        <goalkeepersContext.Provider value={goalkeepers}>
            <goalkeepersReadyContext.Provider value={loaded}>
                <newGoalkeeperContext.Provider value={newGoalkeeper}>
                    <newGoalkeeperErrorContext.Provider value={newGoalkeeperError}>
                        {props.children}
                    </newGoalkeeperErrorContext.Provider>
                </newGoalkeeperContext.Provider>
            </goalkeepersReadyContext.Provider>
        </goalkeepersContext.Provider>
    )
}