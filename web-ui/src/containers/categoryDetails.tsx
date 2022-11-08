import { Avatar, Box, Button, Card, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useCategory, useCategoryError, useCategoryReady, useCategoryTrainers, useCategoryTrainersReady } from '../contexts/categoryContext';
import { CategoryDTO, UserDTO } from '../DTOs';
import { Link as RouterLink } from 'react-router-dom';

function CategoryDetails() {
    const { id } = useParams();

    const [category, setCategory] = useState<CategoryDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const [trainers, setTrainers] = useState<UserDTO[]>([])

    const categoryContext = useCategory()
    const categoryError = useCategoryError()
    const categoryReady = useCategoryReady()

    const trainersContext = useCategoryTrainers()
    const trainersReady = useCategoryTrainersReady()


    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (categoryContext) {
            categoryContext(id ? id : "").then(
                data => setCategory(data as CategoryDTO)
            )
        }


        if (loaded && categoryReady && categoryError) {
            setError("No category Found.")
        }
        if (loaded && categoryReady && !categoryError) {
            setError("")
        }
    }, [loaded, categoryReady, categoryError, id])

    useEffect(() => {
        if (trainersContext) {
            trainersContext(id ? id : "").then((data) => {
                if (trainersReady)
                    setTrainers(data as UserDTO[])
            }
            )

        }
        console.log("trainers: ", trainers)
    }, [trainersReady])

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Typography
                    variant='h4'
                    mb={2}>
                    {`${category?.name} ${category?.season}`}
                </Typography>

                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={4} sm={4} md={6}>
                        <Card sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="flex-end">
                                <Button>
                                    Add Coach
                                </Button>
                            </Box>
                            <List>
                                {trainers.map((trainer) => (
                                    <ListItem
                                        key={trainer.id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete">
                                                <MdDeleteOutline />
                                            </IconButton>
                                        }
                                    >
                                        <RouterLink to={`/users/${trainer.id}`}>
                                            <ListItemAvatar>
                                                <Avatar src={trainer.profile_pic} />
                                            </ListItemAvatar>
                                        </RouterLink>
                                        <ListItemText
                                            primary={trainer.username}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                        </Card>
                    </Grid>

                    <Grid item xs={4} sm={4} md={6}>
                        <Card sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="flex-end">
                                <Button>
                                    Add Goalkeeper
                                </Button>
                            </Box>
                            <p>Goalkeepers</p>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

        </>

    )
}

export default CategoryDetails