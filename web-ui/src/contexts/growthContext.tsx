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

const growthUpdatedContext = createContext<boolean>(false);
export function useGrowthUpdated() {
    return useContext(growthUpdatedContext);
}

// DELETE GROWTH CONTEXTS
type DeleteGrowthDelegate = (growthID: string) => Promise<null>;
const deleteGrowthContext = createContext<DeleteGrowthDelegate | null>(null);
export function useDeleteGrowth() {
    return useContext(deleteGrowthContext);
}

const growthDeletedContext = createContext<boolean>(false);
export function useGrowthDeleted() {
    return useContext(growthDeletedContext);
}

const deleteGrowthErrorContext = createContext<string>("");
export function useDeleteGrowthError() {
    return useContext(deleteGrowthErrorContext);
}

// PROVIDER
export default function GrowthProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState<string>("")
    const [growthUpdated, setGrowthUpdated] = useState<boolean>(false)
    const [growthDeleted, setGrowthDeleted] = useState<boolean>(false)

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
            return json_data as GrowthDTO;
        }
        else {
            setGrowthUpdated(false)
            return json_data as errorResponse;
        }
    }

    const deleteGrowth: DeleteGrowthDelegate = async (growthID: string) => {
        setError("")
        setGrowthDeleted(false)
        console.log(growthID)
        return fetch("/api/growth_monitoring?id=" + growthID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => {
                if (data.status == 204) {
                    setGrowthDeleted(true)
                } else {
                    setGrowthDeleted(false)
                    setError("Could not delete this object")
                }
                return null
            })
    }

    type contextProvider = {
        ctx: React.Context<any>,
        value: any
    }
    const providers: contextProvider[] = [
        {
            ctx: updateGrowthContext,
            value: updateGrowth
        },
        {
            ctx: growthUpdatedContext,
            value: growthUpdated
        },
        {
            ctx: deleteGrowthContext,
            value: deleteGrowth
        },
        {
            ctx: growthDeletedContext,
            value: growthDeleted
        },
        {
            ctx: deleteGrowthErrorContext,
            value: error
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