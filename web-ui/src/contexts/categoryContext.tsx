import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO, UserDTO } from '../DTOs';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';
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

// GET TRAINERS CONTEXT
type CategoryTrainersDelegate = (id: string) => Promise<UserDTO[] | errorResponse>;
const categoryTrainersContext = createContext<CategoryTrainersDelegate | null>(null)
export function useCategoryTrainers() {
    return useContext(categoryTrainersContext)
}

const categoryTrainersReadyContext = createContext<boolean>(false);
export function useCategoryTrainersReady() {
    return useContext(categoryTrainersReadyContext);
}

// GET GOALKEEPERS CONTEXT
type CategoryGoalkeepersDelegate = (id: string) => Promise<GoalkeeperDTO[] | errorResponse>;
const categoryGoalkeepersContext = createContext<CategoryGoalkeepersDelegate | null>(null)
export function useCategoryGoalkeepers() {
    return useContext(categoryGoalkeepersContext)
}

const categoryGoalkeepersReadyContext = createContext<boolean>(false);
export function useCategoryGoalkeepersReady() {
    return useContext(categoryGoalkeepersReadyContext);
}

// ADD TRAINER CONTEXT
type NewCategoryTrainerDelegate = (userId: string, categoryId: string) => Promise<UserDTO | errorResponse>;
const newCategoryTrainerContext = createContext<NewCategoryTrainerDelegate | null>(null);
export function useNewCategoryTrainer() {
    return useContext(newCategoryTrainerContext);
}

const categoryTrainerAddedContext = createContext<boolean>(false);
export function useCategoryTrainerAdded() {
    return useContext(categoryTrainerAddedContext);
}

// ADD GOALKEEPER CONTEXT
type NewCategoryGoalkeeperDelegate = (goalkeeperId: string, categoryId: string) => Promise<GoalkeeperDTO | errorResponse>;
const newCategoryGoalkeeperContext = createContext<NewCategoryGoalkeeperDelegate | null>(null);
export function useNewCategoryGoalkeeper() {
    return useContext(newCategoryGoalkeeperContext);
}

const categoryGoalkeeperAddedContext = createContext<boolean>(false);
export function useCategoryGoalkeeperAdded() {
    return useContext(categoryGoalkeeperAddedContext);
}

// DELETE TRAINER CONTEXT
type DeleteCategoryTrainerDelegate = (userId: string, categoryId: string) => Promise<null>;
const deleteCategoryTrainerContext = createContext<DeleteCategoryTrainerDelegate | null>(null);
export function useDeleteCategoryTrainer() {
    return useContext(deleteCategoryTrainerContext);
}

const categoryTrainerDeletedContext = createContext<boolean>(false);
export function useCategoryTrainerDeleted() {
    return useContext(categoryTrainerDeletedContext);
}

// DELETE GOALKEEPER CONTEXT
type DeleteCategoryGoalkeeperDelegate = (goalkeeperId: string, categoryId: string) => Promise<null>;
const deleteCategoryGoalkeeperContext = createContext<DeleteCategoryGoalkeeperDelegate | null>(null);
export function useDeleteCategoryGoalkeeper() {
    return useContext(deleteCategoryGoalkeeperContext);
}

const categoryGoalkeeperDeletedContext = createContext<boolean>(false);
export function useCategoryGoalkeeperDeleted() {
    return useContext(categoryGoalkeeperDeletedContext);
}


// PROVIDER
export default function CategoryProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [categoryReady, setCategoryReady] = useState<boolean>(false)

    const [categoryTrainersReady, setCategoryTrainersReady] = useState<boolean>(false)
    const [categoryTrainerAdded, setCategoryTrainerAdded] = useState<boolean>(false)
    const [categoryTrainerDeleted, setCategoryTrainerDeleted] = useState<boolean>(false)

    const [categoryGoalkeepersReady, setCategoryGoalkeepersReady] = useState<boolean>(false)
    const [categoryGoalkeeperAdded, setCategoryGoalkeeperAdded] = useState<boolean>(false)
    const [categoryGoalkeeperDeleted, setCategoryGoalkeeperDeleted] = useState<boolean>(false)

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

    const trainers: CategoryTrainersDelegate = async (id: string) => {
        setCategoryTrainerAdded(false)
        setCategoryTrainerDeleted(false)
        const data = await fetch("/api/category/trainers?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setError(false);
            return json_data as UserDTO[];
        }
        else {
            setCategoryTrainersReady(true)
            setError(true);
            return json_data as errorResponse;
        }
    }

    const goalkeepers: CategoryGoalkeepersDelegate = async (id: string) => {
        setCategoryGoalkeeperAdded(false)
        setCategoryGoalkeeperDeleted(false)
        const data = await fetch("/api/category/goalkeepers?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setCategoryGoalkeepersReady(true)
            setError(false);
            return json_data as GoalkeeperDTO[];
        }
        else {
            setCategoryGoalkeepersReady(true)
            setError(true);
            return json_data as errorResponse;
        }
    }

    const newCategoryTrainer: NewCategoryTrainerDelegate = (userId: string, categoryId: string) => {
        return fetch("/api/user/category", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                trainer_id: userId,
                category_id: categoryId
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setError(true)
                    setCategoryTrainerAdded(false)
                    return data as errorResponse
                } else {
                    setCategoryTrainerAdded(true)
                    return data as UserDTO
                }
            })
    }

    const newCategoryGoalkeeper: NewCategoryGoalkeeperDelegate = (goalkeeperId: string, categoryId: string) => {
        return fetch("/api/goalkeeper/category", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                goalkeeper_id: goalkeeperId,
                category_id: categoryId
            })
        })
            .then(data => data.json())
            .then(data => {
                if ("error" in data) {
                    setError(true)
                    setCategoryGoalkeeperAdded(false)
                    return data as errorResponse
                } else {
                    setCategoryGoalkeeperAdded(true)
                    return data as GoalkeeperDTO
                }
            })
    }

    const deleteCategoryTrainer: DeleteCategoryTrainerDelegate = async (userId: string, categoryId: string) => {
        return fetch("/api/user/category", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                trainer_id: userId,
                category_id: categoryId
            })
        })
            .then(data => {
                if (data.status == 204) {
                    setError(false)
                    setCategoryTrainerDeleted(true)
                } else {
                    setError(true)
                    setCategoryTrainerDeleted(false)
                }
                return null
            })
    }

    const deleteCategoryGoalkeeper: DeleteCategoryTrainerDelegate = async (goalkeeperId: string, categoryId: string) => {
        return fetch("/api/goalkeeper/category", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                goalkeeper_id: goalkeeperId,
                category_id: categoryId
            })
        })
            .then(data => {
                if (data.status == 204) {
                    setError(false)
                    setCategoryGoalkeeperDeleted(true)
                } else {
                    setError(true)
                    setCategoryGoalkeeperDeleted(false)
                }
                return null
            })
    }

    return (
        <categoryContext.Provider value={category}>
            <categoryErrorContext.Provider value={error}>
                <categoryReadyContext.Provider value={categoryReady}>
                    <categoryTrainersContext.Provider value={trainers}>
                        <categoryTrainersReadyContext.Provider value={categoryTrainersReady}>
                            <categoryGoalkeepersContext.Provider value={goalkeepers}>
                                <categoryGoalkeepersReadyContext.Provider value={categoryGoalkeepersReady}>
                                    <newCategoryTrainerContext.Provider value={newCategoryTrainer}>
                                        <categoryTrainerAddedContext.Provider value={categoryTrainerAdded}>
                                            <newCategoryGoalkeeperContext.Provider value={newCategoryGoalkeeper}>
                                                <categoryGoalkeeperAddedContext.Provider value={categoryGoalkeeperAdded}>
                                                    <deleteCategoryTrainerContext.Provider value={deleteCategoryTrainer}>
                                                        <categoryTrainerDeletedContext.Provider value={categoryTrainerDeleted}>
                                                            <deleteCategoryGoalkeeperContext.Provider value={deleteCategoryGoalkeeper}>
                                                                <categoryGoalkeeperDeletedContext.Provider value={categoryGoalkeeperDeleted}>
                                                                    {props.children}
                                                                </categoryGoalkeeperDeletedContext.Provider>
                                                            </deleteCategoryGoalkeeperContext.Provider>
                                                        </categoryTrainerDeletedContext.Provider>
                                                    </deleteCategoryTrainerContext.Provider>
                                                </categoryGoalkeeperAddedContext.Provider>
                                            </newCategoryGoalkeeperContext.Provider>
                                        </categoryTrainerAddedContext.Provider>
                                    </newCategoryTrainerContext.Provider>
                                </categoryGoalkeepersReadyContext.Provider>
                            </categoryGoalkeepersContext.Provider>
                        </categoryTrainersReadyContext.Provider>
                    </categoryTrainersContext.Provider>
                </categoryReadyContext.Provider>
            </categoryErrorContext.Provider>
        </categoryContext.Provider>
    )
}