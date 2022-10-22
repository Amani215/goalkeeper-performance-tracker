import React, { PropsWithChildren, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/userContext'

//Menu, headers, footer...
const PortalPage = ({ children }: PropsWithChildren<{}>) => {
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
            <div>portal Page</div>
            <div>{children}</div>
        </>
    )
}

export default PortalPage