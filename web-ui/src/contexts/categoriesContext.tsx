import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { CategoryDTO } from "../DTOs";
import { NewCategoryDTO } from "../DTOs/CategoryDTO";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";

// GET CATEGORIES CONTEXT
const categoriesContext = createContext<CategoryDTO[] | null>(null)
export function useCategories() {
    return useContext(categoriesContext)
}

const categoriesReadyContext = createContext<boolean>(false)
export function useCategoriesReady() {
    return useContext(categoriesReadyContext)
}

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

export default function CategoriesProvider(props: PropsWithChildren<{}>) {
    const [categories, setCategories] = useState<CategoryDTO[] | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

    const [newCategoryError, setNewCategoryError] = useState(false)

    const auth = useAuth()
    const token = auth?.token

    const getCategories = async () => {
        const categoriesArray: CategoryDTO[] = await fetch("/api/category", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        })
            .then(data => data.json())
            .then((data) => {
                if ("error" in data) {
                    return [] as CategoryDTO[]
                }
                const dataString = JSON.stringify(data)
                const categoriesDTO: CategoryDTO[] = JSON.parse(dataString)
                return categoriesDTO
            })
        setCategories(categoriesArray)
        setLoaded(true)
    }

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
                    setCategories([...categories as CategoryDTO[], data as CategoryDTO])
                    return data as CategoryDTO
                }
            })
    }

    useEffect(() => {
        getCategories()
    }, [loaded])

    return (
        <categoriesContext.Provider value={categories}>
            <categoriesReadyContext.Provider value={loaded}>
                <newCategoryContext.Provider value={newCategory}>
                    <newCategoryErrorContext.Provider value={newCategoryError}>
                        {props.children}
                    </newCategoryErrorContext.Provider>
                </newCategoryContext.Provider>
            </categoriesReadyContext.Provider>
        </categoriesContext.Provider>
    )
}