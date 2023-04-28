import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { CategoryDTO } from "../DTOs";
import { NewCategoryDTO } from "../DTOs/CategoryDTO";
import { errorResponse } from "../interfaces/errorResponse";
import { useAuth } from "./authContext";

// GET CATEGORIES CONTEXT
const archivedCategoriesContext = createContext<CategoryDTO[] | null>(null)
export function useArchivedCategories() {
    return useContext(archivedCategoriesContext)
}

const nonArchivedCategoriesContext = createContext<CategoryDTO[] | null>(null)
export function useNonArchivedCategories() {
    return useContext(nonArchivedCategoriesContext)
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

// DELETE CATEGORY CONTEXTS
type DeleteCategoryDelegate = (categoryID: string) => Promise<null>;
const deleteCategoryContext = createContext<DeleteCategoryDelegate | null>(null);
export function useDeleteCategory() {
    return useContext(deleteCategoryContext);
}

const categoryDeletedContext = createContext<boolean>(false);
export function useCategoryDeleted() {
    return useContext(categoryDeletedContext);
}

const deleteCategoryErrorContext = createContext<string>("");
export function useDeleteCategoryError() {
    return useContext(deleteCategoryErrorContext);
}

// ARCHIVE CATEGORY CONTEXT
type ArchiveCategoryDelegate = (categoryID: string, archived: boolean) => Promise<null>;
const archiveCategoryContext = createContext<ArchiveCategoryDelegate | null>(null);
export function useArchiveCategory() {
    return useContext(archiveCategoryContext);
}

const categoryArchivedContext = createContext<boolean>(false);
export function useCategoryArchived() {
    return useContext(categoryArchivedContext);
}

export default function CategoriesProvider(props: PropsWithChildren<{}>) {
    const [archivedCategories, setArchivedCategories] = useState<CategoryDTO[] | null>(null)
    const [nonArchivedCategories, setNonArchivedCategories] = useState<CategoryDTO[] | null>(null)
    const [loaded, setLoaded] = useState<boolean>(false)

    const [newCategoryError, setNewCategoryError] = useState(false)
    const [categoryDeleted, setCategoryDeleted] = useState(false)
    const [categoryArchived, setCategoryArchived] = useState(false)
    const [deleteCategoryError, setDeleteCategoryError] = useState("")

    const auth = useAuth()
    const token = auth?.token

    const getCategories = async (archived: boolean) => {
        setCategoryDeleted(false)
        setCategoryArchived(false)
        setDeleteCategoryError("")
        const categoriesArray: CategoryDTO[] = await fetch("/api/category?archived=" + archived, {
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
        if (archived)
            setArchivedCategories(categoriesArray)
        else
            setNonArchivedCategories(categoriesArray)
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
                season: newCategoryObj.season.replace('/', '-')
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setNewCategoryError(true)
                    return data as errorResponse
                } else {
                    setNewCategoryError(false)
                    setNonArchivedCategories([...nonArchivedCategories as CategoryDTO[], data as CategoryDTO])
                    return data as CategoryDTO
                }
            })
    }

    const deleteCategory: DeleteCategoryDelegate = async (categoryId: string) => {
        setDeleteCategoryError("")
        return fetch("/api/category?id=" + categoryId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({})
        })
            .then(data => {
                if (data.status == 204) {
                    setCategoryDeleted(true)
                } else {
                    setCategoryDeleted(false)
                    if (data.status == 401) {
                        setDeleteCategoryError("This category is connected to other entities")
                    }
                }
                return null
            })
    }

    const archiveCategory: ArchiveCategoryDelegate = async (categoryId: string, archived: boolean) => {
        setDeleteCategoryError("")
        return fetch("/api/category?id=" + categoryId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                "archived": archived
            })
        })
            .then(data => {
                if (data.status == 201) {
                    setCategoryArchived(true)
                } else {
                    setCategoryArchived(false)
                }
                return null
            })
    }

    useEffect(() => {
        getCategories(true)
        getCategories(false)
    }, [loaded, categoryDeleted, categoryArchived])

    return (
        <archivedCategoriesContext.Provider value={archivedCategories}>
            <nonArchivedCategoriesContext.Provider value={nonArchivedCategories}>
                <categoriesReadyContext.Provider value={loaded}>
                    <newCategoryContext.Provider value={newCategory}>
                        <newCategoryErrorContext.Provider value={newCategoryError}>
                            <deleteCategoryContext.Provider value={deleteCategory}>
                                <categoryDeletedContext.Provider value={categoryDeleted}>
                                    <deleteCategoryErrorContext.Provider value={deleteCategoryError}>
                                        <archiveCategoryContext.Provider value={archiveCategory}>
                                            <categoryArchivedContext.Provider value={categoryArchived}>
                                                {props.children}
                                            </categoryArchivedContext.Provider>
                                        </archiveCategoryContext.Provider>
                                    </deleteCategoryErrorContext.Provider>
                                </categoryDeletedContext.Provider>
                            </deleteCategoryContext.Provider>
                        </newCategoryErrorContext.Provider>
                    </newCategoryContext.Provider>
                </categoriesReadyContext.Provider>
            </nonArchivedCategoriesContext.Provider>
        </archivedCategoriesContext.Provider>
    )
}