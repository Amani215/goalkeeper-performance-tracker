import { Avatar, Box, Button, Card, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useCategory, useCategoryError, useCategoryGoalkeeperAdded, useCategoryGoalkeeperDeleted, useCategoryGoalkeepers, useCategoryGoalkeepersReady, useCategoryReady, useCategoryTrainerAdded, useCategoryTrainerDeleted, useCategoryTrainers, useCategoryTrainersReady, useDeleteCategoryGoalkeeper, useDeleteCategoryTrainer } from '../contexts/categoryContext';
import { CategoryDTO, UserDTO } from '../DTOs';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';
import { useAuth } from '../contexts/authContext';
import { MultiModalProp } from '../interfaces/modalProp';

function CategoryDetails({ modal1, modal2 }: MultiModalProp) {
    const { id } = useParams();
    const auth = useAuth()

    const [category, setCategory] = useState<CategoryDTO | null>(null)
    const [, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const [trainers, setTrainers] = useState<UserDTO[]>([])
    const [goalkeepers, setGoalkeepers] = useState<GoalkeeperDTO[]>([])

    const categoryContext = useCategory()
    const categoryError = useCategoryError()
    const categoryReady = useCategoryReady()

    const trainersContext = useCategoryTrainers()
    const trainersReady = useCategoryTrainersReady()
    const trainerAdded = useCategoryTrainerAdded()
    const deleteTrainerContext = useDeleteCategoryTrainer()
    const trainerDeleted = useCategoryTrainerDeleted()

    const goalkeepersContext = useCategoryGoalkeepers()
    const goalkeepersReady = useCategoryGoalkeepersReady()
    const goalkeeperAdded = useCategoryGoalkeeperAdded()
    const deleteGoalkeeperContext = useDeleteCategoryGoalkeeper()
    const goalkeeperDeleted = useCategoryGoalkeeperDeleted()

    // INIT PAGE
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
            })
        }
    }, [trainersReady, trainerAdded, trainerDeleted])

    useEffect(() => {
        if (goalkeepersContext) {
            goalkeepersContext(id ? id : "").then((data) => {
                if (goalkeepersReady)
                    setGoalkeepers(data as GoalkeeperDTO[])
            })
        }
    }, [goalkeepersReady, goalkeeperAdded, goalkeeperDeleted])

    // DELETE EVENTS
    const deleteGoalkeeper = async (goalkeeperId: string) => {
        if (deleteGoalkeeperContext) {
            await deleteGoalkeeperContext(goalkeeperId, id as string)
        }
    }

    const deleteTrainer = async (userId: string) => {
        if (deleteTrainerContext) {
            await deleteTrainerContext(userId, id as string)
        }
    }

    return (
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
                        {auth?.user.admin ?
                            <Box display="flex" justifyContent="flex-end">
                                <Button onClick={() => { modal1.setModalIsOpen() }}>
                                    Add a Coach
                                </Button>
                            </Box> : <></>
                        }

                        {trainers.length > 0 ?
                            <List>
                                {trainers.map((trainer) => (
                                    <ListItem
                                        key={trainer.id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={e => deleteTrainer(trainer.id)}>
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
                            : <Box display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center">
                                No coaches yet.
                            </Box>
                        }

                    </Card>
                </Grid>

                <Grid item xs={4} sm={4} md={6}>
                    <Card sx={{ padding: 2 }}>
                        {auth?.user.admin ?
                            <Box display="flex" justifyContent="flex-end">
                                <Button onClick={() => { modal2.setModalIsOpen() }}>
                                    Add a Goalkeeper
                                </Button>
                            </Box> : <></>
                        }

                        {goalkeepers.length > 0 ?
                            <List>
                                {goalkeepers.map((goalkeeper) => (
                                    <ListItem
                                        key={goalkeeper.id}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={e => deleteGoalkeeper(goalkeeper.id)}>
                                                <MdDeleteOutline />
                                            </IconButton>
                                        }
                                    >
                                        <RouterLink to={`/goalkeepers/${goalkeeper.id}`}>
                                            <ListItemAvatar>
                                                <Avatar src={goalkeeper.picture} />
                                            </ListItemAvatar>
                                        </RouterLink>
                                        <ListItemText
                                            primary={goalkeeper.name}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            : <Box display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center">
                                No goalkeepers yet.
                            </Box>
                        }
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CategoryDetails