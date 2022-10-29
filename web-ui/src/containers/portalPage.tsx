import React, { PropsWithChildren, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/userContext'
import Header from '../components/header'

//Menu, headers, footer...
const PortalPage = ({ children }: PropsWithChildren<{}>) => {
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false)
    
    useEffect(
        () => setLoaded(true), []
    )
    const user = useUser()
    const location = useLocation()
    if(loaded && !user){
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return (
        <>
            <Header onOpenNav={() => setOpen(true)} />
            <div>{children}</div>
        </>
    )
}

export default PortalPage