import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Link, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { MdDeleteOutline, MdMode } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDeleteTrainingGoalkeeper, useGetTraining, useTrainingError, useTrainingGoalkeepersUpdated, useTrainingPerformances, useTrainingPerformancesReady, useTrainingReady, useTrainingUpdated, useUpdateTrainingForm } from '../contexts/trainingContext';
import { TrainingDTO } from '../DTOs/TrainingDTO';
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO'
import { ModalProp } from '../interfaces/modalProp';
import { useTrainingPerformanceUpdated, useUpdateTrainingPerformance } from '../contexts/trainingPerformanceContext';


function TrainingDetails({ setModalIsOpen }: ModalProp) {
    const { id } = useParams();

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
    const deleteTrainingGoalkeeper = useDeleteTrainingGoalkeeper()
    const updateAttendanceContext = useUpdateTrainingPerformance()
    const attendanceUpdated = useTrainingPerformanceUpdated()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (trainingContext) {
            trainingContext(id ? id : "").then(
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
            deleteTrainingGoalkeeper(goalkeeperToDelete ? goalkeeperToDelete.id : "", id ? id : "")
                .then(() => handleCloseDeleteGoalkeeperDialog())
        }
    }

    const updateAttendance = (gpId: string) => {
        if (updateAttendanceContext) {
            updateAttendanceContext({
                id: gpId,
                attendance: 'present'
            })
        }
    }

    const updateTrainingForm = useUpdateTrainingForm()
    const uploadTrainingForm = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const formdata = new FormData()
            formdata.append("training_form", e.target.files[0])
            if (updateTrainingForm) {
                updateTrainingForm(id ? id : "", formdata).then((data) => { console.log(data) })
            }
            console.log(e.target.files[0])
        }
    }

    useEffect(() => {
        if (performancesContext) {
            performancesContext(id ? id : "").then((data) => {
                if (performancesReady)
                    setGoalkeeperPerformances(data != null ? data : goalkeeperPerformances)
            })
        }
    }, [performancesReady, performancesUpdated, attendanceUpdated])

    return (
        <>
            {error != "" ?
                <Typography>Could not find training.</Typography> :
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography
                        variant='h4'
                        mb={2}>
                        {`Training ${training?.category?.id}`}
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
                            Upload Form
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
                                        Download Form
                                    </Link>
                                </Button>
                                : <Typography>No training form uploaded.</Typography>
                            }
                        </Box>


                    </Box>

                    <Paper
                        elevation={2}
                        sx={{ width: '100%', bgcolor: 'background.paper', padding: '10px' }}>
                        <Box
                            display="flex" justifyContent="flex-end"
                            mb={2}>
                            <Button variant='contained' onClick={() => { setModalIsOpen() }}>Add Goalkeeper</Button>
                        </Box>
                        {goalkeeperPerformances.length > 0 ?
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {goalkeeperPerformances.map((gp) => (
                                    <div key={gp.id}>
                                        <ListItem secondaryAction={<>
                                            <IconButton edge="end" aria-label="update" onClick={() => { updateAttendance(gp.id) }}>
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
                                            <ListItemText primary={gp.goalkeeper.name} secondary={gp.attendance} />
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
                                <Typography>No goalkeepers yet.</Typography>
                            </Box>
                        }
                    </Paper>
                </Box >
            }

            <Dialog
                open={deleteGoalkeeperDialogIsOpen}
                onClose={handleCloseDeleteGoalkeeperDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        By clicking yes, you are going to delete {goalkeeperToDelete?.goalkeeper.name} from the list of goalkeepers permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteGoalkeeperDialog}>Cancel</Button>
                    <Button onClick={() => deleteGoalkeeperPerformance()} autoFocus>Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TrainingDetails