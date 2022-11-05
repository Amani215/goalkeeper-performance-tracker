import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { CategoryDTO } from "../DTOs";
import { useAuth } from "./authContext";


const categoriesContext = createContext<CategoryDTO[] | null>(null)
export function useCategories() {
    return useContext(categoriesContext)
}

const categoriesReadyContext = createContext<boolean>(false)
export function useCategoriesReady() {
    return useContext(categoriesReadyContext)
}

export default function CategoryProvider(props: PropsWithChildren<{}>) {
    const [categories, setCategories] = useState<CategoryDTO[] | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

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

    useEffect(() => {
        getCategories()
    }, [loaded])

    return (
        <categoriesContext.Provider value={categories}>
            <categoriesReadyContext.Provider value={loaded}>
                {props.children}
            </categoriesReadyContext.Provider>
        </categoriesContext.Provider>
    )
}