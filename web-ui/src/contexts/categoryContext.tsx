import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO } from '../DTOs';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';


// GET CATEGORY CONTEXTS
type CategoryDelegate = (id: string) => Promise<CategoryDTO | errorResponse>;
const categoryContext = createContext<CategoryDelegate | null>(null);
export function useCategory() {
    return useContext(categoryContext);
}

const categoryErrorContext = createContext<boolean>(false);
export function useCategoryError() {
    return useContext(categoryErrorContext);
}

const categoryReadyContext = createContext<boolean>(false);
export function useCategoryReady() {
    return useContext(categoryReadyContext);
}

// PROVIDER
export default function CategoryProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [categoryReady, setCategoryReady] = useState<boolean>(false)

    const auth = useAuth()
    const token = auth?.token

    const category: CategoryDelegate = async (id: string) => {
        const data = await fetch("/api/category?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setCategoryReady(true);
            setError(false);
            return json_data as CategoryDTO;
        }
        else {
            setError(true);
            setCategoryReady(true);
            return json_data as errorResponse;
        }
    }

    return (
        <categoryContext.Provider value={category}>
            <categoryErrorContext.Provider value={error}>
                <categoryReadyContext.Provider value={categoryReady}>
                    {props.children}
                </categoryReadyContext.Provider>
            </categoryErrorContext.Provider>
        </categoryContext.Provider>
    )
}