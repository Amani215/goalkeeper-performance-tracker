import { Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useCategory, useCategoryError, useCategoryGoalkeeperAdded, useCategoryGoalkeeperDeleted, useCategoryGoalkeepers, useCategoryGoalkeepersReady, useCategoryReady, useCategoryTrainerAdded, useCategoryTrainerDeleted, useCategoryTrainers, useCategoryTrainersReady, useDeleteCategoryGoalkeeper, useDeleteCategoryTrainer } from '../contexts/categoryContext';
import { CategoryDTO, UserDTO } from '../DTOs';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';
import { useAuth } from '../contexts/authContext';
import { MultiModalProp } from '../interfaces/modalProp';
import { useTranslation } from 'react-i18next';
import { useGetDocument } from '../contexts/documentGenerationContext';

function CategoryDetails({ modal1, modal2 }: MultiModalProp) {
    const { id } = useParams();
    const auth = useAuth()
    const { t } = useTranslation()

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

    // GET DOCUMENT
    const documentContext = useGetDocument()

    const generateDoc = async () => {
        if (documentContext) {
            await documentContext("goalkeepers", category ? category.id : "").then(res => {
                if (res != null) {
                    window.open(res, "_blank")
                }
            })
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
            <Button variant="contained" onClick={() => { generateDoc() }}>
                {t("list_goalkeepers_per_category")}
            </Button>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={4} sm={4} md={6}>
                    <Card sx={{ padding: 2 }}>
                        {auth?.user.admin && !category?.archived ?
                            <Box display="flex" justifyContent="flex-end">
                                <Button onClick={() => { modal1.setModalIsOpen() }}>
                                    {t("add_coach")}
                                </Button>
                            </Box> : <></>
                        }

                        {trainers.length > 0 ?
                            <List>
                                {trainers.map((trainer) => (
                                    <ListItem
                                        key={trainer.id}
                                        secondaryAction={
                                            auth?.user.admin && !category?.archived ?
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
                                {t("no_coaches")}
                            </Box>
                        }

                    </Card>
                </Grid>

                <Grid item xs={4} sm={4} md={6}>
                    <Card sx={{ padding: 2 }}>
                        {auth?.user.admin && !category?.archived ?
                            <Box display="flex" justifyContent="flex-end">
                                <Button onClick={() => { modal2.setModalIsOpen() }}>
                                    {t("add_goalkeeper")}
                                </Button>
                            </Box> : <></>
                        }

                        {goalkeepers.length > 0 ?
                            <List>
                                {goalkeepers.map((goalkeeper) => (
                                    <ListItem
                                        key={goalkeeper.id}
                                        secondaryAction={
                                            auth?.user.admin && !category?.archived ?
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
                                {t("no_goalkeepers")}
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
                <DialogTitle id="alert-dialog-title"> {t("are_you_sure")} </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("deleting_coach_category_warning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteCoachDialog}>{t("cancel")}</Button>
                    <Button onClick={() => deleteTrainer()} autoFocus>{t("yes")}</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Goalkeeper Dialog */}
            <Dialog
                open={deleteGoalkeeperDialogIsOpen}
                onClose={handleCloseDeleteGoalkeeperDialog}
            >
                <DialogTitle id="alert-dialog-title">{t("are_you_sure")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("deleting_goalkeeper_category_warning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteGoalkeeperDialog}>{t("cancel")}</Button>
                    <Button onClick={() => deleteGoalkeeper()} autoFocus>{t("yes")}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default CategoryDetails