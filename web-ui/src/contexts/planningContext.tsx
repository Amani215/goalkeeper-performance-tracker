import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import { NewPlanningDTO, PlanningDTO, UpdatePlanningDTO } from '../DTOs/PlanningDTO';

// ADD PLANNING CONTEXTS
type NewPlanningDelegate = (newPlanningObj: NewPlanningDTO) => Promise<PlanningDTO | errorResponse>;
const newPlanningContext = createContext<NewPlanningDTO | null>(null);
export function useNewPlanning() {
    return useContext(newPlanningContext);
}

const planningAddedContext = createContext<boolean>(false);
export function usePlanningAdded() {
    return useContext(planningAddedContext);
}

// UPDATE PLANNING CONTEXT
type UpdatePlanningDelegate = (id: string, planningObj: UpdatePlanningDTO) => Promise<PlanningDTO | errorResponse>;
const updatePlanningContext = createContext<UpdatePlanningDTO | null>(null);
export function useUpdatePlanning() {
    return useContext(updatePlanningContext);
}

const planningUpdatedContext = createContext<boolean>(false);
export function usePlanningUpdated() {
    return useContext(planningUpdatedContext);
}

// DELETE PLANNING CONTEXTS
type DeletePlanningDelegate = (planningID: string) => Promise<null>;
const deletePlanningContext = createContext<DeletePlanningDelegate | null>(null);
export function useDeletePlanning() {
    return useContext(deletePlanningContext);
}

const planningDeletedContext = createContext<boolean>(false);
export function usePlanningDeleted() {
    return useContext(planningDeletedContext);
}

const deletePlanningErrorContext = createContext<string>("");
export function useDeletePlanningError() {
    return useContext(deletePlanningErrorContext);
}

// PROVIDER
export default function PlanningProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState<string>("")
    const [planningUpdated, setPlanningUpdated] = useState<boolean>(false)
    const [planningDeleted, setPlanningDeleted] = useState<boolean>(false)
    const [planningAdded, setPlanningAdded] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const newPlanning: NewPlanningDelegate = (newPlanningObj: NewPlanningDTO) => {
        return fetch("/api/planning", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                category_id: newPlanningObj.category_id,
                date: newPlanningObj.date,
                type: newPlanningObj.type
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    return data as errorResponse
                } else {
                    setPlanningAdded(true)
                    return data as PlanningDTO
                }
            })
    }

    const updatePlanning: UpdatePlanningDelegate = async (id: string, planningObj: UpdatePlanningDTO) => {
        const data = await fetch("/api/planning?id=" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                date: planningObj.date,
                type: planningObj.type,
                tactics: planningObj.tactics,
                techniques: planningObj.techniques,
                physiques: planningObj.physiques,
                psychomotricity: planningObj.psychomotricity,
                observation: planningObj.observation
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setPlanningUpdated(true)
            return json_data as PlanningDTO;
        }
        else {
            setPlanningUpdated(false)
            return json_data as errorResponse;
        }
    }

    const deletePlanning: DeletePlanningDelegate = async (planningID: string) => {
        setError("")
        setPlanningDeleted(false)
        return fetch("/api/planning?id=" + planningID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => {
                if (data.status == 204) {
                    setPlanningDeleted(true)
                } else {
                    setPlanningDeleted(false)
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
            ctx: newPlanningContext,
            value: newPlanning
        },
        {
            ctx: planningAddedContext,
            value: planningAdded
        },
        {
            ctx: updatePlanningContext,
            value: updatePlanning
        },
        {
            ctx: planningUpdatedContext,
            value: planningUpdated
        },
        {
            ctx: deletePlanningContext,
            value: deletePlanning
        },
        {
            ctx: planningDeletedContext,
            value: planningDeleted
        },
        {
            ctx: deletePlanningErrorContext,
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