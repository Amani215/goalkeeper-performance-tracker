import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { GoalkeeperDTO } from "../DTOs/GoalkeeperDTO";
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


export default function GoalkeepersProvider(props: PropsWithChildren<{}>) {
    const [goalkeepers, setGoalkeepers] = useState<GoalkeeperDTO[] | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

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

    useEffect(() => {
        getGoalkeepers()
    }, [loaded, token])

    return (
        <goalkeepersContext.Provider value={goalkeepers}>
            <goalkeepersReadyContext.Provider value={loaded}>
                {props.children}
            </goalkeepersReadyContext.Provider>
        </goalkeepersContext.Provider>
    )
}