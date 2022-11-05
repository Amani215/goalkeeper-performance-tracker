import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO, NewCategoryDTO } from '../DTOs/CategoryDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';

// GET CATEGORY CONTEXTS

// ADD CATEGORY CONTEXTS
type NewCategoryDelegate = (newCategoryObj: NewCategoryDTO) => Promise<CategoryDTO | errorResponse>;
const newCategoryContext = createContext<NewCategoryDelegate | null>(null);
export function useNewCategory() {
    return useContext(newCategoryContext);
}

const newCategoryErrorContext = createContext<boolean>(false);
export function useNewCategoryError() {
    return useContext(newCategoryErrorContext);
}

// PROVIDER
export default function CategoryProvider(props: PropsWithChildren<{}>) {
    const [newCategoryError, setNewCategoryError] = useState(false)

    const auth = useAuth()
    const token = auth?.token

    const newCategory: NewCategoryDelegate = (newCategoryObj: NewCategoryDTO) => {
        return fetch("/api/category", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                name: newCategoryObj.name,
                season: newCategoryObj.season
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setNewCategoryError(true)
                    return data as errorResponse
                } else {
                    setNewCategoryError(false)
                    return data as CategoryDTO
                }
            })
    }

    return (
        <newCategoryContext.Provider value={newCategory}>
            <newCategoryErrorContext.Provider value={newCategoryError}>
                {props.children}
            </newCategoryErrorContext.Provider>
        </newCategoryContext.Provider>
    )
}