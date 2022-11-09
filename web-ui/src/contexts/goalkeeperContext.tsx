import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO } from '../DTOs';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';

// GET GOALKEEPER CONTEXTS
type GoalkeeperDelegate = (id: string) => Promise<GoalkeeperDTO | errorResponse>;
const goalkeeperContext = createContext<GoalkeeperDelegate | null>(null);
export function useGoalkeeper() {
    return useContext(goalkeeperContext);
}

const goalkeeperErrorContext = createContext<boolean>(false);
export function useGoalkeeperError() {
    return useContext(goalkeeperErrorContext);
}

const goalkeeperReadyContext = createContext<boolean>(false);
export function useGoalkeeperReady() {
    return useContext(goalkeeperReadyContext);
}

// GET CATEGORIES CONTEXT
type GoalkeeperCategoriesDelegate = (id: string) => Promise<CategoryDTO[] | errorResponse>;
const goalkeeperCategoriesContext = createContext<GoalkeeperCategoriesDelegate | null>(null)
export function useGoalkeeperCategories() {
    return useContext(goalkeeperCategoriesContext)
}

const goalkeeperCategoriesReadyContext = createContext<boolean>(false);
export function useGoalkeeperCategoriesReady() {
    return useContext(goalkeeperCategoriesReadyContext);
}

// PROFILE PIC CONTEXT
type PictureDelegate = (id: string, formdata: FormData) => Promise<string | errorResponse>;
const updatePictureContext = createContext<PictureDelegate | null>(null);
export function useUpdatePicture() {
    return useContext(updatePictureContext);
}

// PROVIDER
export default function GoalkeeperProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [goalkeeperReady, setGoalkeeperReady] = useState<boolean>(false)

    const [goalkeeperCategoriesReady, setGoalkeeperCategoriesReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const goalkeeper: GoalkeeperDelegate = async (id: string) => {
        const data = await fetch("/api/goalkeeper?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setGoalkeeperReady(true);
            setError(false);
            return json_data as GoalkeeperDTO;
        }
        else {
            setError(true);
            setGoalkeeperReady(true);
            return json_data as errorResponse;
        }
    }

    const categories: GoalkeeperCategoriesDelegate = async (id: string) => {
        const data = await fetch("/api/goalkeeper/category?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setError(false);
            return json_data as CategoryDTO[];
        }
        else {
            setGoalkeeperCategoriesReady(true)
            setError(true);
            return json_data as errorResponse;
        }
    }

    const picture: PictureDelegate = (id: string, formdata: FormData) => {
        return fetch("/api/goalkeeper/picture?id=" + id, {
            method: "PUT",
            headers: {
                'Accept': '*/*',
                'Authorization': `bearer ${token}`
            },
            body: formdata
        })
            .then(data => data.json())
    }

    return (
        <goalkeeperContext.Provider value={goalkeeper}>
            <goalkeeperErrorContext.Provider value={error}>
                <goalkeeperReadyContext.Provider value={goalkeeperReady}>
                    <goalkeeperCategoriesContext.Provider value={categories}>
                        <goalkeeperCategoriesReadyContext.Provider value={goalkeeperCategoriesReady}>
                            <updatePictureContext.Provider value={picture}>
                                {props.children}
                            </updatePictureContext.Provider>
                        </goalkeeperCategoriesReadyContext.Provider>
                    </goalkeeperCategoriesContext.Provider>
                </goalkeeperReadyContext.Provider>
            </goalkeeperErrorContext.Provider>
        </goalkeeperContext.Provider>
    )
}