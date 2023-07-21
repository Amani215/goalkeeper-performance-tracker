import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import { CalendarDTO, CalendarItemDTO, NewCalendarDTO, NewCalendarItemDTO } from '../DTOs/CalendarDTO';

// ADD CALENDAR CONTEXTS
type NewCalendarDelegate = (newCalendarObj: NewCalendarDTO) => Promise<CalendarDTO | errorResponse>;
const newCalendarContext = createContext<NewCalendarDelegate | null>(null);
export function useNewCalendar() {
    return useContext(newCalendarContext);
}

const calendarAddedContext = createContext<boolean>(false);
export function useCalendarAdded() {
    return useContext(calendarAddedContext);
}

const addCalendarErrorContext = createContext<string>("");
export function useAddCalendarError() {
    return useContext(addCalendarErrorContext);
}

// DELETE CALENDAR CONTEXTS
type DeleteCalendarDelegate = (calendarID: string) => Promise<null>;
const deleteCalendarContext = createContext<DeleteCalendarDelegate | null>(null);
export function useDeleteCalendar() {
    return useContext(deleteCalendarContext);
}

const calendarDeletedContext = createContext<boolean>(false);
export function useCalendarDeleted() {
    return useContext(calendarDeletedContext);
}

const deleteCalendarErrorContext = createContext<string>("");
export function useDeleteCalendarError() {
    return useContext(deleteCalendarErrorContext);
}

// ADD CALENDAR ITEM CONTEXTS
type NewCalendarItemDelegate = (newCalendarItemObj: NewCalendarItemDTO) => Promise<CalendarItemDTO | errorResponse>;
const newCalendarItemContext = createContext<NewCalendarItemDelegate | null>(null);
export function useNewCalendarItem() {
    return useContext(newCalendarItemContext);
}

const calendarItemAddedContext = createContext<boolean>(false);
export function useCalendarItemAdded() {
    return useContext(calendarItemAddedContext);
}

const addCalendarItemErrorContext = createContext<string>("");
export function useAddCalendarItemError() {
    return useContext(addCalendarItemErrorContext);
}

// DELETE CALENDAR ITEM CONTEXTS
type DeleteCalendarItemDelegate = (calendarItemID: string) => Promise<null>;
const deleteCalendarItemContext = createContext<DeleteCalendarItemDelegate | null>(null);
export function useDeleteCalendarItem() {
    return useContext(deleteCalendarItemContext);
}

const calendarItemDeletedContext = createContext<boolean>(false);
export function useCalendarItemDeleted() {
    return useContext(calendarItemDeletedContext);
}

const deleteCalendarItemErrorContext = createContext<string>("");
export function useDeleteCalendarItemError() {
    return useContext(deleteCalendarItemErrorContext);
}

// PROVIDER
export default function CalendarProvider(props: PropsWithChildren<{}>): JSX.Element {
    const [error, setError] = useState<string>("")
    const [calendarDeleted, setCalendarDeleted] = useState<boolean>(false)
    const [calendarAdded, setCalendarAdded] = useState<boolean>(false)
    const [calendarItemAdded, setCalendarItemAdded] = useState<boolean>(false)
    const [calendarItemDeleted, setCalendarItemDeleted] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const newCalendar: NewCalendarDelegate = (newCalendarObj: NewCalendarDTO) => {
        setCalendarAdded(false)
        return fetch("/api/calendar", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                category_id: newCalendarObj.category_id,
                type: newCalendarObj.calendar_type
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    throw (data["error"])
                    // return data as errorResponse
                } else {
                    setCalendarAdded(true)
                    return data as CalendarDTO
                }
            })
    }

    const deleteCalendar: DeleteCalendarDelegate = async (calendarID: string) => {
        setError("")
        setCalendarDeleted(false)
        return fetch("/api/calendar?id=" + calendarID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => {
                if (data.status == 204) {
                    setCalendarDeleted(true)
                } else {
                    setCalendarDeleted(false)
                    setError("Could not delete this object")
                }
                return null
            })
    }

    const newCalendarItem: NewCalendarItemDelegate = (newCalendarItemObj: NewCalendarItemDTO) => {
        setCalendarItemAdded(false)
        return fetch("/api/calendar/item", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                calendar_id: newCalendarItemObj.calendar_id,
                journey: newCalendarItemObj.journey,
                local: newCalendarItemObj.local,
                visitor: newCalendarItemObj.visitor
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    throw (data["error"])
                    // return data as errorResponse
                } else {
                    setCalendarItemAdded(true)
                    return data as CalendarItemDTO
                }
            })
    }

    const deleteCalendarItem: DeleteCalendarItemDelegate = async (calendarItemID: string) => {
        setError("")
        setCalendarItemDeleted(false)
        return fetch("/api/calendar/item?id=" + calendarItemID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => {
                if (data.status == 204) {
                    setCalendarItemDeleted(true)
                } else {
                    setCalendarItemDeleted(false)
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
            ctx: newCalendarContext,
            value: newCalendar
        },
        {
            ctx: calendarAddedContext,
            value: calendarAdded
        },
        {
            ctx: deleteCalendarContext,
            value: deleteCalendar
        },
        {
            ctx: calendarDeletedContext,
            value: calendarDeleted
        },
        {
            ctx: deleteCalendarErrorContext,
            value: error
        },
        {
            ctx: newCalendarItemContext,
            value: newCalendarItem
        },
        {
            ctx: calendarItemAddedContext,
            value: calendarItemAdded
        },
        {
            ctx: addCalendarItemErrorContext,
            value: error
        },
        {
            ctx: deleteCalendarItemContext,
            value: deleteCalendarItem
        },
        {
            ctx: calendarItemDeletedContext,
            value: calendarItemDeleted
        },
        {
            ctx: deleteCalendarItemErrorContext,
            value: error
        },
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