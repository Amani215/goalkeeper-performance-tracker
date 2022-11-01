import { PropsWithChildren, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, useUserReady } from '../contexts/userContext'
import Header from '../components/header'
import SideNav from '../components/sideNav'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

//Menu, headers, footer...
const PortalPage = ({ children }: PropsWithChildren<{}>) => {
    const [loaded, setLoaded] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const auth = useAuth()
    const userReady = useUserReady()
    const location = useLocation()

    useEffect(
        () => setLoaded(true), []
    )
    useEffect(() => {
        if (loaded && userReady && !auth?.user) {
            setRedirect(true)
        }
    }, [loaded, userReady, auth?.user])
    if (redirect) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return (
        <>
            <Header auth={auth} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <SideNav />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    {children}
                </Box>
            </Box>
        </>
    )
}

export default PortalPage