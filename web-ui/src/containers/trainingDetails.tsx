import { Avatar, Box, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDeleteTrainingGoalkeeper, useGetTraining, useTrainingError, useTrainingGoalkeepersUpdated, useTrainingPerformances, useTrainingPerformancesReady, useTrainingReady } from '../contexts/trainingContext';
import { TrainingDTO } from '../DTOs/TrainingDTO';
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO'
import { ModalProp } from '../interfaces/modalProp';
import { useUpdateTrainingForm } from '../contexts/trainingPerformanceContext';

function TrainingDetails({ setModalIsOpen }: ModalProp) {
    const { id } = useParams();

    const [training, setTraining] = useState<TrainingDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const trainingContext = useGetTraining()
    const trainingError = useTrainingError()
    const trainingReady = useTrainingReady()

    const [goalkeeperPerformances, setGoalkeeperPerformances] = useState<TrainingMonitoringDTO[]>([])
    const performancesContext = useTrainingPerformances()
    const performancesReady = useTrainingPerformancesReady()
    const performancesUpdated = useTrainingGoalkeepersUpdated()
    const deleteTrainingGoalkeeper = useDeleteTrainingGoalkeeper()

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
    }, [loaded, trainingReady, trainingError, id])

    const deleteGoalkeeperPerformance = (gpId: string) => {
        if (deleteTrainingGoalkeeper) {
            deleteTrainingGoalkeeper(gpId, id ? id : "")
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
                    setGoalkeeperPerformances(data != null ? data as TrainingMonitoringDTO[] : goalkeeperPerformances)
            })
        }
    }, [performancesReady, performancesUpdated])

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
                        flexDirection="column"
                        mb={2}>
                        <Button component="label" variant="contained">
                            Upload Form
                            <input
                                hidden
                                accept="application/pdf"
                                multiple type="file"
                                onChange={e => uploadTrainingForm(e)} />
                        </Button>
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
                                            <IconButton edge="end" aria-label="delete" onClick={() => { deleteGoalkeeperPerformance(gp.id) }}>
                                                <MdDeleteOutline />
                                            </IconButton>
                                        </>}>
                                            <ListItemAvatar>
                                                <RouterLink to={`/goalkeepers/${gp.goalkeeper.id}`}>
                                                    <Avatar src={gp.goalkeeper.picture}></Avatar>
                                                </RouterLink>
                                            </ListItemAvatar>
                                            <ListItemText primary={gp.goalkeeper.name} />
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
                </Box>
            }
        </>
    )
}

export default TrainingDetails