import { PropsWithChildren, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, useAuthReady } from '../contexts/authContext'
import Header from '../components/header'
import SideNav from '../components/sideNav'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { Typography } from '@mui/material'

//Menu, headers, footer...
const PortalPage = ({ children }: PropsWithChildren<{}>) => {
    const [loaded, setLoaded] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const auth = useAuth()
    const authReady = useAuthReady()
    const location = useLocation()

    useEffect(
        () => setLoaded(true), []
    )
    useEffect(() => {
        if (loaded && authReady && !auth?.user) {
            setRedirect(true)
        }
    }, [loaded, authReady, auth?.user])
    function PageName() {
        if (location.pathname.split('/')[2]) return <></>
        return <Typography
            variant='h5'
            sx={{
                textTransform: 'capitalize',
                fontWeight: 'bold'
            }}
            style={{ color: '#757575' }}
            mb={2}>
            {location.pathname.split('/')[1] || "Dashboard"}
        </Typography>
    }
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
                    <PageName />
                    {children}
                </Box>
            </Box>
        </>
    )
}

export default PortalPage