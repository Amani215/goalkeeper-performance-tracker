import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { CategoryDTO } from '../DTOs';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO';
import { errorResponse } from '../interfaces/errorResponse';
import { useAuth } from './authContext';
import { GrowthDTO } from '../DTOs/GrowthDTO';

// GET GOALKEEPER CONTEXTS
type GoalkeeperDelegate = (id: string) => Promise<GoalkeeperDTO | errorResponse>;
const getGoalkeeperContext = createContext<GoalkeeperDelegate | null>(null);
export function useGetGoalkeeper() {
    return useContext(getGoalkeeperContext);
}

const goalkeeperContext = createContext<GoalkeeperDTO | null>(null);
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

// GET MATCH PERFORMANCES CONTEXTS
type GoalkeeperMatchesDelegate = (id: string) => Promise<MatchMonitoringDTO[] | errorResponse>;
const goalkeeperMatchesContext = createContext<GoalkeeperMatchesDelegate | null>(null)
export function useGoalkeeperMatches() {
    return useContext(goalkeeperMatchesContext)
}

const goalkeeperMatchesReadyContext = createContext<boolean>(false);
export function useGoalkeeperMatchesReady() {
    return useContext(goalkeeperMatchesReadyContext);
}

// GET TRAINING PERFORMANCES CONTEXTS
type GoalkeeperTrainingsDelegate = (id: string) => Promise<TrainingMonitoringDTO[] | errorResponse>;
const goalkeeperTrainingsContext = createContext<GoalkeeperTrainingsDelegate | null>(null)
export function useGoalkeeperTrainings() {
    return useContext(goalkeeperTrainingsContext)
}

const goalkeeperTrainingsReadyContext = createContext<boolean>(false);
export function useGoalkeeperTrainingsReady() {
    return useContext(goalkeeperTrainingsReadyContext);
}

// GET GROWTH MONITORING OBJECTS CONTEXTS
type GoalkeeperGrowthDelegate = (id: string) => Promise<GrowthDTO[] | []>;
const goalkeeperGrowthContext = createContext<GoalkeeperGrowthDelegate | null>(null);
export function useGoalkeeperGrowthContext() {
    return useContext(goalkeeperGrowthContext);
}

const goalkeeperGrowthReadyContext = createContext<boolean>(false);
export function useGoalkeeperGrowthReady() {
    return useContext(goalkeeperGrowthReadyContext);
}

// PROFILE PIC CONTEXT
type PictureDelegate = (id: string, formdata: FormData) => Promise<string | errorResponse>;
const updatePictureContext = createContext<PictureDelegate | null>(null);
export function useUpdatePicture() {
    return useContext(updatePictureContext);
}

// UPDATE GOALKEEPER CONTEXTS
type UpdateGoalkeeperDelegate = (id: string, birthday: string, phone: string) => Promise<GoalkeeperDTO | errorResponse>;
const updateGoalkeeperContext = createContext<UpdateGoalkeeperDelegate | null>(null);
export function useUpdateGoalkeeper() {
    return useContext(updateGoalkeeperContext);
}

const goalkeeperUpdatedContext = createContext<boolean>(false);
export function useGoalkeeperUpdated() {
    return useContext(goalkeeperUpdatedContext);
}

// PROVIDER
export default function GoalkeeperProvider(props: PropsWithChildren<{}>) {
    const [error, setError] = useState(false)
    const [goalkeeper, setGoalkeeper] = useState<GoalkeeperDTO | null>(null)
    const [goalkeeperReady, setGoalkeeperReady] = useState<boolean>(false)
    const [goalkeeperUpdated, setGoalkeeperUpdated] = useState<boolean>(false);

    const [goalkeeperCategoriesReady, setGoalkeeperCategoriesReady] = useState<boolean>(false)
    const [goalkeeperMatchesReady, setGoalkeeperMatchesReady] = useState<boolean>(false)
    const [goalkeeperTrainingsReady, setGoalkeeperTrainingsReady] = useState<boolean>(false)
    const [goalkeeperGrowthReady, setGoalkeeperGrowthReady] = useState<boolean>(false)


    const auth = useAuth()
    const token = auth?.token

    const getGoalkeeper: GoalkeeperDelegate = async (id: string) => {
        setGoalkeeperUpdated(false)
        const data = await fetch("/api/goalkeeper?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setGoalkeeper(json_data as GoalkeeperDTO)
            setGoalkeeperReady(true);
            setError(false);
            return json_data as GoalkeeperDTO;
        }
        else {
            setGoalkeeper(null)
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

    const matches: GoalkeeperMatchesDelegate = async (id: string) => {
        const data = await fetch("/api/goalkeeper/match_performances?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setError(false);
            return json_data as MatchMonitoringDTO[];
        }
        else {
            setGoalkeeperMatchesReady(true)
            setError(true);
            return json_data as errorResponse;
        }
    }

    const trainings: GoalkeeperTrainingsDelegate = async (id: string) => {
        const data = await fetch("/api/goalkeeper/training_performances?id=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setError(false);
            setGoalkeeperTrainingsReady(true)
            return json_data as TrainingMonitoringDTO[];
        }
        else {
            setGoalkeeperTrainingsReady(true)
            setError(true);
            return json_data as errorResponse;
        }
    }

    const growth: GoalkeeperGrowthDelegate = async (id: string) => {
        const data = await fetch("/api/growth_monitoring?gid=" + id, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            }
        });
        const json_data = await data.json();
        if (data.status == 200) {
            setGoalkeeperGrowthReady(true);
            setError(false);
            return json_data as GrowthDTO[];
        }
        else {
            setError(true);
            setGoalkeeperGrowthReady(true);
            return [];
        }
    }

    const picture: PictureDelegate = async (id: string, formdata: FormData) => {
        const data = await fetch("/api/goalkeeper/picture?id=" + id, {
            method: "PUT",
            headers: {
                'Accept': '*/*',
                'Authorization': `bearer ${token}`
            },
            body: formdata
        });
        return await data.json();
    }

    const updateGoalkeeper: UpdateGoalkeeperDelegate = async (id: string, birthday: string, phone: string) => {
        const data = await fetch("/api/goalkeeper?id="+id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                birthday: birthday,
                phone: phone
            })
        });
        const json_data = await data.json();
        if ('id' in json_data) {
            setGoalkeeperReady(true);
            setError(false);
            setGoalkeeper(json_data as GoalkeeperDTO)
            setGoalkeeperUpdated(true)
            return json_data as GoalkeeperDTO;
        }
        else {
            setError(true);
            setGoalkeeperReady(true);
            setGoalkeeper(null)
            return json_data as errorResponse;
        }
    }

    return (
        <getGoalkeeperContext.Provider value={getGoalkeeper}>
            <goalkeeperContext.Provider value={goalkeeper}>
                <goalkeeperErrorContext.Provider value={error}>
                    <goalkeeperReadyContext.Provider value={goalkeeperReady}>
                        <goalkeeperCategoriesContext.Provider value={categories}>
                            <goalkeeperCategoriesReadyContext.Provider value={goalkeeperCategoriesReady}>
                                <goalkeeperMatchesContext.Provider value={matches}>
                                    <goalkeeperMatchesReadyContext.Provider value={goalkeeperMatchesReady}>
                                        <goalkeeperTrainingsContext.Provider value={trainings}>
                                            <goalkeeperTrainingsReadyContext.Provider value={goalkeeperTrainingsReady}>
                                                <goalkeeperGrowthContext.Provider value={growth}>
                                                    <goalkeeperGrowthReadyContext.Provider value={goalkeeperGrowthReady}>
                                                        <updatePictureContext.Provider value={picture}>
                                                            <updateGoalkeeperContext.Provider value={updateGoalkeeper}>
                                                                <goalkeeperUpdatedContext.Provider value={goalkeeperUpdated}>
                                                            {props.children}
                                                            </goalkeeperUpdatedContext.Provider>
                                                            </updateGoalkeeperContext.Provider>
                                                        </updatePictureContext.Provider>
                                                    </goalkeeperGrowthReadyContext.Provider>
                                                </goalkeeperGrowthContext.Provider>
                                            </goalkeeperTrainingsReadyContext.Provider>
                                        </goalkeeperTrainingsContext.Provider>
                                    </goalkeeperMatchesReadyContext.Provider>
                                </goalkeeperMatchesContext.Provider>
                            </goalkeeperCategoriesReadyContext.Provider>
                        </goalkeeperCategoriesContext.Provider>
                    </goalkeeperReadyContext.Provider>
                </goalkeeperErrorContext.Provider>
            </goalkeeperContext.Provider>
        </getGoalkeeperContext.Provider>
    )
}