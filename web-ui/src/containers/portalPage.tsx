import { PropsWithChildren, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, useAuthReady } from '../contexts/authContext'
import Header from '../components/header'
import SideNav from '../components/sideNav'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ChangePassword from './modals/changePassword'

function PageName() {
    const { t } = useTranslation();
    const location = useLocation()
    if (location.pathname.split('/')[2]) return <></>

    const pageName: string = location.pathname.split('/')[1] || "Dashboard"
    return <Typography
        variant='h5'
        sx={{
            textTransform: 'capitalize',
            fontWeight: 'bold'
        }}
        style={{ color: '#757575' }}
        mb={2}>
        {t(pageName)}
    </Typography>
}


//Menu, headers, footer...
const PortalPage = ({ children }: PropsWithChildren<{}>) => {
    const location = useLocation()
    const authReady = useAuthReady()
    const auth = useAuth()

    const [loaded, setLoaded] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const [passwordModalOpen, setPasswordModalOpen] = useState(true)
    const [changePassword, setChangePassword] = useState(false)

    useEffect(
        () => setLoaded(true), []
    )
    useEffect(() => {
        if (loaded && authReady && !auth?.user) {
            setRedirect(true)
        }
        if (loaded && authReady && auth?.user.first_login) {
            setChangePassword(true)
        }
    }, [loaded, authReady, auth?.user])

    const closeChangePassword = () => {
        setPasswordModalOpen(false)
        setChangePassword(false)
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

                    {changePassword ?
                        <ChangePassword modalIsOpen={passwordModalOpen} setModalIsOpen={closeChangePassword} />
                        : <></>}
                </Box>
            </Box>
        </>
    )
}

export default PortalPage