import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import { GrowthDTO, UpdateGrowthDTO } from '../DTOs/GrowthDTO';


// UPDATE GROWTH CONTEXT
type UpdateGrowthDelegate = (id: string, growthObj: UpdateGrowthDTO) => Promise<GrowthDTO | errorResponse>;
const updateGrowthContext = createContext<UpdateGrowthDelegate | null>(null);
export function useUpdateGrowth() {
    return useContext(updateGrowthContext);
}

// PROVIDER
export default function GrowthProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState(false)
    const [growthReady, setGrowthReady] = useState<boolean>(false)
    const [growthUpdated, setGrowthUpdated] = useState<boolean>(false)
    const [growth, setGrowth] = useState<GrowthDTO | null>(null)

    const auth = useAuth()
    const token = auth?.token

    const updateGrowth: UpdateGrowthDelegate = async (id: string, growthObj: UpdateGrowthDTO) => {
        const data = await fetch("/api/growth_monitoring?id=" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                date: growthObj.date,
                height: growthObj.height,
                weight: growthObj.weight,
                annual_growth: growthObj.annual_growth,
                torso_height: growthObj.torso_height,
                thoracic_perimeter: growthObj.thoracic_perimeter
            })
        });
        const json_data = await data.json();
        console.log(json_data)
        if ('id' in json_data) {
            setGrowthUpdated(true)
            setGrowthReady(true);
            setError(false);
            setGrowth(json_data as GrowthDTO)
            return json_data as GrowthDTO;
        }
        else {
            setGrowthUpdated(false)
            setError(true);
            setGrowthReady(true);
            setGrowth(null)
            return json_data as errorResponse;
        }
    }

    type contextProvider = {
        ctx: React.Context<any>,
        value: any
    }
    const providers: contextProvider[] = [
        {
            ctx: updateGrowthContext,
            value: updateGrowth
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