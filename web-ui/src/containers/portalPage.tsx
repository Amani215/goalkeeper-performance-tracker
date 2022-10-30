import { PropsWithChildren, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/userContext'
import Header from '../components/header'
import SideNav from '../components/sideNav'
import PageProvider from '../contexts/pageContext'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

//Menu, headers, footer...
const PortalPage = ({ children }: PropsWithChildren<{}>) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(
        () => setLoaded(true), []
    )

    const user = useUser()
    const location = useLocation()
    if (loaded && !user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return (
        <PageProvider>
            <Header />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <SideNav />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    {children}
                </Box>
            </Box>
        </PageProvider>
    )
}

export default PortalPage