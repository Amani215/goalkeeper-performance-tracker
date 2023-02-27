import { Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
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

    // DELETE GOALKEEPER
    const [goalkeeperToDelete, setGoalkeeperToDelete] = useState<GoalkeeperDTO | null>(null)
    const [deleteGoalkeeperDialogIsOpen, setDeleteGoalkeeperDialogIsOpen] = useState<boolean>(false)

    const handleOpenDeleteGoalkeeperDialog = (goalkeeper: GoalkeeperDTO) => {
        setGoalkeeperToDelete(goalkeeper)
        setDeleteGoalkeeperDialogIsOpen(true)
    }

    const handleCloseDeleteGoalkeeperDialog = () => {
        setDeleteGoalkeeperDialogIsOpen(false)
        setGoalkeeperToDelete(null)
    }

    const deleteGoalkeeper = async () => {
        if (deleteGoalkeeperContext) {
            await deleteGoalkeeperContext(goalkeeperToDelete ? goalkeeperToDelete.id : '', id as string)
            setDeleteGoalkeeperDialogIsOpen(false)
        }
    }


    // DELETE TRAINER
    const [trainerToDelete, setTrainerToDelete] = useState<UserDTO | null>()
    const [deleteCoachDialogIsOpen, setDeleteCoachDialogIsOpen] = useState<boolean>(false)

    const handleOpenDeleteCoachDialog = (trainer: UserDTO) => {
        setTrainerToDelete(trainer)
        setDeleteCoachDialogIsOpen(true)
    }

    const handleCloseDeleteCoachDialog = () => {
        setDeleteCoachDialogIsOpen(false)
        setTrainerToDelete(null)
    }

    const deleteTrainer = async () => {
        if (deleteTrainerContext) {
            await deleteTrainerContext(trainerToDelete ? trainerToDelete.id : '', id as string)
            setDeleteCoachDialogIsOpen(false)
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
                                            auth?.user.admin ?
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={e => handleOpenDeleteCoachDialog(trainer)}>
                                                    <MdDeleteOutline />
                                                </IconButton> : <></>
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
                                            auth?.user.admin ?
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={e => handleOpenDeleteGoalkeeperDialog(goalkeeper)}>
                                                    <MdDeleteOutline />
                                                </IconButton> : <></>
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

            {/* Delete Coach Dialog */}
            <Dialog
                open={deleteCoachDialogIsOpen}
                onClose={handleCloseDeleteCoachDialog}
            >
                <DialogTitle id="alert-dialog-title"> {"Are you sure?"} </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        By clicking yes, you are going to delete {trainerToDelete?.username} from the list of coaches permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteCoachDialog}>Cancel</Button>
                    <Button onClick={() => deleteTrainer()} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Goalkeeper Dialog */}
            <Dialog
                open={deleteGoalkeeperDialogIsOpen}
                onClose={handleCloseDeleteGoalkeeperDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        By clicking yes, you are going to delete {goalkeeperToDelete?.name} from the list of goalkeepers permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteGoalkeeperDialog}>Cancel</Button>
                    <Button onClick={() => deleteGoalkeeper()} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CategoryDetails