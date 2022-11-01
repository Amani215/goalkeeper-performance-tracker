import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLogout, useAuth, useAuthReady } from '../../contexts/authContext';

const Logout = () => {
    const logout = useLogout()
    const [loaded, setLoaded] = useState(false)
    const location = useLocation()
    const auth = useAuth()

    const authReady = useAuthReady()

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

    if (loaded && authReady && !auth?.user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return (
        <></>
    )
}

export default Logout