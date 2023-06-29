import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import { GrowthDTO, NewGrowthDTO, UpdateGrowthDTO } from '../DTOs/GrowthDTO';

// ADD GROWTH CONTEXTS
type NewGrowthDelegate = (newGrowthObj: NewGrowthDTO) => Promise<GrowthDTO | errorResponse>;
const newGrowthContext = createContext<NewGrowthDelegate | null>(null);
export function useNewGrowth() {
    return useContext(newGrowthContext);
}

const growthAddedContext = createContext<boolean>(false);
export function useGrowthAdded() {
    return useContext(growthAddedContext);
}

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
    const [growthAdded, setGrowthAdded] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const newGrowth: NewGrowthDelegate = (newGrowthObj: NewGrowthDTO) => {
        setGrowthAdded(false)
        return fetch("/api/growth_monitoring", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                goalkeeper_id: newGrowthObj.goalkeeper_id,
                date: newGrowthObj.date
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    return data as errorResponse
                } else {
                    setGrowthAdded(true)
                    return data as GrowthDTO
                }
            })
    }

    const updateGrowth: UpdateGrowthDelegate = async (id: string, growthObj: UpdateGrowthDTO) => {
        setGrowthUpdated(false)
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
            ctx: newGrowthContext,
            value: newGrowth
        },
        {
            ctx: growthAddedContext,
            value: growthAdded
        },
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