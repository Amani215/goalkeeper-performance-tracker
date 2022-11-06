import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/authContext'
import { useUser, useUserError, useUserReady } from '../contexts/userContext'
import { UserDTO } from '../DTOs'

function UserDetails() {
    const { id } = useParams();

    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [user, setUser] = useState<UserDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const auth = useAuth()
    const userContext = useUser()
    const userError = useUserError()
    const userReady = useUserReady()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (userContext) {
            userContext(id ? id : "").then(
                data => setUser(data as UserDTO)
            )
        }
        if (loaded && userReady && userError) {
            setError("No user Found.")
        }
        if (loaded && userReady && !userError) {
            setError("")
        }
    }, [loaded, userReady, userError])

    useEffect(() => {
        if (auth && auth.user.id == id) {
            setIsCurrentUser(true)
        }
    }, [auth, user])

    return (
        <>
            {error != "" ?
                <Typography
                    variant='subtitle2'
                    ml={1} mt={1}>
                    {error}
                </Typography>
                :
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={4} sm={5} md={8} order={{ xs: 2, sm: 1, md: 1 }}>
                        <Card sx={{ padding: 2 }}>
                            <Box
                                display="flex"
                                flexDirection="row">
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}
                                    mr={2}>
                                    Name
                                </Typography>
                                <Typography
                                    variant='body1'>
                                    {user?.username}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="row">
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}
                                    mr={2}>
                                    Status
                                </Typography>
                                <Typography
                                    variant='body1'>
                                    {user?.admin ? "Admin" : "Coach"}
                                </Typography>
                            </Box>

                            <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 'bold' }}
                                mr={2}>
                                Associated Categories
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={4} sm={3} md={4} order={{ xs: 1, sm: 2, md: 2 }}>
                        <Card sx={{ width: "auto" }}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                component="img"
                                sx={{
                                    maxHeight: { xs: "100%", sm: "100%", md: 500 },
                                    maxWidth: { xs: "100%", sm: 350, md: 500 },
                                }}
                                alt="Example Coach"
                                src={user?.profile_pic ? user.profile_pic : "https://pressboxonline.com/wp-content/uploads/2021/01/dan-enos-800x445.jpg"}
                            />
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                mb={1}>
                                <Typography
                                    variant='subtitle2'
                                    sx={{ fontStyle: 'italic' }}
                                    ml={1} mt={1}>
                                    UID: {id}
                                </Typography>
                                {isCurrentUser ?
                                    <Button component="label">
                                        Change Picture
                                        <input hidden accept="image/*" multiple type="file" />
                                    </Button>
                                    : <></>
                                }

                            </Box>

                        </Card>
                    </Grid>
                </Grid>
            }
        </>

    )
}

export default UserDetails