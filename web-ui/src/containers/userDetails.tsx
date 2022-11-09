import { Chip, Link, List, ListItem, ListItemText, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/authContext'
import { useUpdateProfilePic, useUser, useUserCategories, useUserCategoriesReady, useUserError, useUserReady } from '../contexts/userContext'
import { CategoryDTO, UserDTO } from '../DTOs'
import { IoFootball } from "react-icons/io5"

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
    const updateProfilePic = useUpdateProfilePic()

    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const categoriesContext = useUserCategories()
    const categoriesReady = useUserCategoriesReady()

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
    }, [loaded, userReady, userError, id])

    useEffect(() => {
        if (auth && auth.user.id == id) {
            setIsCurrentUser(true)
        }
    }, [auth, user])

    useEffect(() => {
        if (categoriesContext) {
            categoriesContext(id ? id : "").then((data) => {
                if (categoriesReady)
                    setCategories(data as CategoryDTO[])
            })
        }
    }, [categoriesReady])

    const uploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const formdata = new FormData()
            formdata.append("profile_pic", e.target.files[0])
            if (updateProfilePic) {
                updateProfilePic(formdata).then((data) => { console.log(data) })
            }
            console.log(e.target.files[0])
        }
    }

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
                            {auth?.user.admin ?
                                <Box display="flex" justifyContent="flex-end">
                                    <Button>
                                        Edit
                                    </Button>
                                </Box> : <></>
                            }

                            <Grid container columns={8}>
                                <Grid item xs={3}>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{ fontWeight: 'bold' }}>
                                        Name
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography
                                        variant='body1'>
                                        {user?.username}
                                    </Typography>
                                </Grid>

                                <Grid item xs={3}>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{ fontWeight: 'bold' }}>
                                        Status
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography
                                        variant='body1'>
                                        {user?.admin ? "Admin" : "Coach"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={8}>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{ fontWeight: 'bold' }}>
                                        Associated Categories
                                    </Typography>
                                </Grid>

                                <Grid
                                    container
                                    spacing={{ xs: 1 }}
                                    columns={{ xs: 8, sm: 8, md: 12 }} mt={1}>
                                    {categories.length > 0 ?
                                        categories.map((category) => (
                                            <Grid item xs={4} md={3}
                                                key={category.id}
                                                mb={1}
                                            >
                                                <Link
                                                    component={RouterLink}
                                                    to={`/categories/${category.id}`}
                                                    underline="none"
                                                    color="inherit">
                                                    <Chip
                                                        icon={<IoFootball />}
                                                        label={`${category?.name} ${category?.season}`}
                                                        onClick={() => { }} />
                                                </Link>
                                            </Grid>
                                        ))
                                        : <Box display="flex"
                                            flexDirection="column"
                                            justifyContent="center"
                                            alignItems="center">
                                            No associated categories yet.
                                        </Box>}
                                </Grid>
                            </Grid>
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
                                        <input
                                            hidden
                                            accept="image/*"
                                            multiple type="file"
                                            onChange={e => uploadPicture(e)} />
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