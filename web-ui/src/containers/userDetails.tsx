import { Chip, Link, List, ListItem, ListItemText, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../contexts/authContext'
import { useUpdateProfilePic, useGetUser, useUserCategories, useUserCategoriesReady, useUserError, useUserReady, useUserUpdated } from '../contexts/userContext'
import { CategoryDTO, UserDTO } from '../DTOs'
import { IoFootball } from "react-icons/io5"
import { ModalProp } from '../interfaces/modalProp'
import { useTranslation } from 'react-i18next'

function UserDetails({ setModalIsOpen }: ModalProp) {
    const { id } = useParams();
    const { t } = useTranslation();

    const [isCurrentUser, setIsCurrentUser] = useState(false)
    const [user, setUser] = useState<UserDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const auth = useAuth()
    const userContext = useGetUser()
    const userError = useUserError()
    const userReady = useUserReady()
    const userUpdated = useUserUpdated()
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
    }, [loaded, userReady, userError, userUpdated, id])

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
                                    <Button
                                        disabled={user?.admin}
                                        onClick={() => { setModalIsOpen() }}>
                                        {t("edit")}
                                    </Button>
                                </Box> : <></>
                            }

                            <Grid container columns={8}>
                                <Grid item xs={3}>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{ fontWeight: 'bold' }}>
                                        {t("username")}
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
                                        {t("status")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography
                                        variant='body1'>
                                        {user?.admin ? "Admin" : "Coach"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={8} mb={1}>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{ fontWeight: 'bold' }}>
                                        {t("associated_categories")}
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
                                        : <Box pl={1}>
                                            {t("no_categories")}
                                        </Box>
                                    }
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
                                alignItems="center">
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    component="img"
                                    sx={{
                                        maxHeight: { xs: "100%", sm: "100%", md: "32rem" },
                                        maxWidth: { xs: "100%", sm: 350, md: "32rem" },
                                    }}
                                    alt="Image by Stephanie Edwards from Pixabay"
                                    src={user?.profile_pic ? user.profile_pic : `${process.env.PUBLIC_URL}/assets/placeholder.png`}
                                /></Box>

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
                                        {t("change_pic")}
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