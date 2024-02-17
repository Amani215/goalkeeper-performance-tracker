import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { MdDeleteOutline, MdMode } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDeleteTrainingGoalkeeper, useGetTraining, useTrainingError, useTrainingGoalkeepersUpdated, useTrainingPerformanceUpdated, useTrainingPerformances, useTrainingPerformancesReady, useTrainingReady, useTrainingUpdated, useUpdateTrainingForm } from '../contexts/trainingContext';
import { TrainingDTO } from '../DTOs/TrainingDTO';
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO'
import { ModalProp } from '../interfaces/modalProp';
import UpdateAttendance from './modals/updateAttendance';
import { useTranslation } from 'react-i18next';


function TrainingDetails({ setModalIsOpen }: Readonly<ModalProp>) {
    const { id } = useParams();
    const { t } = useTranslation();

    const [training, setTraining] = useState<TrainingDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const trainingContext = useGetTraining()
    const trainingError = useTrainingError()
    const trainingReady = useTrainingReady()
    const trainingUpdated = useTrainingUpdated()

    const [goalkeeperPerformances, setGoalkeeperPerformances] = useState<TrainingMonitoringDTO[]>([])
    const performancesContext = useTrainingPerformances()
    const performancesReady = useTrainingPerformancesReady()
    const performancesUpdated = useTrainingGoalkeepersUpdated()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (trainingContext) {
            trainingContext(id ?? "").then(
                data => setTraining(data as TrainingDTO)
            )
        }

        if (trainingReady && trainingError) {
            setError("No training Found.")
        }
        if (loaded && trainingReady && !trainingError) {
            setError("")
        }
    }, [loaded, trainingReady, trainingError, id, trainingUpdated])

    // DELETE GOALKEEPER
    const deleteTrainingGoalkeeper = useDeleteTrainingGoalkeeper()
    const [deleteGoalkeeperDialogIsOpen, setDeleteGoalkeeperDialogIsOpen] = useState<boolean>(false)
    const [goalkeeperToDelete, setGoalkeeperToDelete] = useState<TrainingMonitoringDTO | null>(null)

    const handleCloseDeleteGoalkeeperDialog = () => {
        setDeleteGoalkeeperDialogIsOpen(false)
        setGoalkeeperToDelete(null)
    }

    const handleOpenDeleteGoalkeeperDialog = (goalkeeper: TrainingMonitoringDTO) => {
        setDeleteGoalkeeperDialogIsOpen(true)
        setGoalkeeperToDelete(goalkeeper)
    }

    const deleteGoalkeeperPerformance = () => {
        if (deleteTrainingGoalkeeper) {
            deleteTrainingGoalkeeper(goalkeeperToDelete ? goalkeeperToDelete.id : "", id ?? "")
                .then(() => handleCloseDeleteGoalkeeperDialog())
        }
    }

    // UPDATE ATTENDANCE
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false)
    const [goalkeeperToUpdate, setGoalkeeperToUpdate] = useState<TrainingMonitoringDTO | null>(null)

    // const updateAttendanceContext = useUpdateTrainingPerformance()
    const attendanceUpdated = useTrainingPerformanceUpdated()

    const handleOpenUpdateModal = (tm: TrainingMonitoringDTO) => {
        setGoalkeeperToUpdate(tm)
        setUpdateModalIsOpen(true)
    }
    const handleCloseUpdateModal = () => {
        setGoalkeeperToUpdate(null)
        setUpdateModalIsOpen(false)
    }

    // UPDATE TRAINING FORM
    const updateTrainingForm = useUpdateTrainingForm()
    const uploadTrainingForm = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const formdata = new FormData()
            formdata.append("training_form", e.target.files[0])
            if (updateTrainingForm) {
                updateTrainingForm(id ?? "", formdata).then((data) => { console.log(data) })
            }
        }
    }

    // LOAD GOALKEEPERS
    useEffect(() => {
        if (performancesContext) {
            performancesContext(id ?? "").then((data) => {
                if (performancesReady)
                    setGoalkeeperPerformances(data ?? goalkeeperPerformances)
            })
        }
    }, [performancesReady, performancesUpdated, attendanceUpdated])

    return (
        <>
            {error != "" ?
                <Typography>{t("no_training")}</Typography> :
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography
                        variant='h4'
                        mb={2}>
                        {`${t("training")} ${training?.category?.id}`}
                    </Typography>
                    <Typography
                        variant='h6'
                        mb={2}>
                        {training?.date}
                    </Typography>
                    <Typography
                        variant='h6'
                        mb={2}>
                        {training?.duration} min
                    </Typography>

                    <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        alignContent="center"
                        mb={2}>
                        <Button component="label" variant="contained">
                            {t("add_form")}
                            <input
                                hidden
                                accept="application/pdf"
                                multiple type="file"
                                onChange={e => uploadTrainingForm(e)} />
                        </Button>
                        <Box ml={1}>
                            {training?.training_form ?
                                <Button variant="outlined">
                                    <Link target="_blank" href={training.training_form} underline="none">
                                        {t("download_form")}
                                    </Link>
                                </Button>
                                : <Typography>{t("no_training_form")}</Typography>
                            }
                        </Box>


                    </Box>

                    <Paper
                        elevation={2}
                        sx={{ width: '100%', bgcolor: 'background.paper', padding: '10px' }}>
                        <Box
                            display="flex" justifyContent="flex-end"
                            mb={2}>
                            <Button variant='contained' onClick={() => { setModalIsOpen() }}>{t("add_goalkeeper")}</Button>
                        </Box>
                        {goalkeeperPerformances.length > 0 ?
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {goalkeeperPerformances.map((gp) => (
                                    <div key={gp.id}>
                                        <ListItem secondaryAction={<>
                                            <IconButton edge="end" aria-label="update" onClick={() => { handleOpenUpdateModal(gp) }}>
                                                <MdMode />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => { handleOpenDeleteGoalkeeperDialog(gp) }}>
                                                <MdDeleteOutline />
                                            </IconButton>
                                        </>}>
                                            <ListItemAvatar>
                                                <RouterLink to={`/goalkeepers/${gp.goalkeeper.id}`}>
                                                    <Avatar src={gp.goalkeeper.picture}></Avatar>
                                                </RouterLink>
                                            </ListItemAvatar>
                                            <ListItemText primary={gp.goalkeeper.name} secondary={`${gp.attendance} - ${gp.attendance_time}`} />
                                        </ListItem>
                                        <Divider />
                                    </div>
                                ))}
                            </List>
                            : <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography>{t("no_goalkeepers")}</Typography>
                            </Box>
                        }
                    </Paper>
                </Box >
            }

            {/* ARE YOU SURE DIALOG */}
            <Dialog
                open={deleteGoalkeeperDialogIsOpen}
                onClose={handleCloseDeleteGoalkeeperDialog}
            >
                <DialogTitle id="alert-dialog-title">{t("are_you_sure")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("deleting_goalkeeper_training_warning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteGoalkeeperDialog}>{t("cancel")}</Button>
                    <Button onClick={() => deleteGoalkeeperPerformance()} autoFocus>{t("yes")}</Button>
                </DialogActions>
            </Dialog>

            <UpdateAttendance tm={goalkeeperToUpdate} modalProp={{
                modalIsOpen: updateModalIsOpen,
                setModalIsOpen: handleCloseUpdateModal
            }} />
        </>
    )
}

export default TrainingDetails