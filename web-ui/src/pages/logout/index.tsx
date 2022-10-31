import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLogout, useUser, useUserReady } from '../../contexts/userContext';

const Logout = () => {
    const logout = useLogout()
    const [loaded, setLoaded] = useState(false)
    const location = useLocation()
    const user = useUser()
    const userReady = useUserReady()

    useEffect(
        () => {
            if (logout) logout()
        }, [logout]
    )

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )
    
    if (loaded && userReady && !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return (
        <></>
    )
}

export default Logout