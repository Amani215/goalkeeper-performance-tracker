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



// PROVIDER
export default function CategoryProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [categoryReady, setCategoryReady] = useState<boolean>(false)
    const [categoryTrainersReady, setCategoryTrainersReady] = useState<boolean>(false)
    const [categoryTrainerAdded, setCategoryTrainerAdded] = useState<boolean>(false)
    const [categoryGoalkeepersReady, setCategoryGoalkeepersReady] = useState<boolean>(false)

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
                                        {props.children}
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