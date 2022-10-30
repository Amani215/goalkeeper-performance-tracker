import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { VoidDelegate } from '../interfaces/voidDelegate';

const sideNavIsOpenContext = createContext<boolean>(false);
export function useSideNavIsOpen(){
    return useContext(sideNavIsOpenContext);
}

const toggleSideNavContext = createContext<VoidDelegate | null>(null);
export function useToggleSideNav(){
    return useContext(toggleSideNavContext);
}

export default function PageProvider(props: PropsWithChildren<{}>){
    const [sideNavIsOpen, setSideNavIsOpen] = useState<boolean>(false);

    const toggleSideNav:VoidDelegate = ()=>{
        setSideNavIsOpen(!sideNavIsOpen);
    }
    
    return(
        <sideNavIsOpenContext.Provider value={sideNavIsOpen}>
            <toggleSideNavContext.Provider value={toggleSideNav}>
                {props.children}
            </toggleSideNavContext.Provider>
        </sideNavIsOpenContext.Provider>
    )
}