import { Avatar, Box, Button, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md';
import { TbFileChart } from 'react-icons/tb';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useGetTraining, useTrainingError, useTrainingReady } from '../contexts/trainingContext';
import { TrainingDTO } from '../DTOs/TrainingDTO';
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO'

function TrainingDetails() {
    const { id } = useParams();

    const [training, setTraining] = useState<TrainingDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const trainingContext = useGetTraining()
    const trainingError = useTrainingError()
    const trainingReady = useTrainingReady()

    const [goalkeeperPerformances, setGoalkeeperPerformances] = useState<TrainingMonitoringDTO[]>([])

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


                    <Paper
                        elevation={2}
                        sx={{ width: '100%', bgcolor: 'background.paper', padding: '10px' }}>
                        <Box
                            display="flex" justifyContent="flex-end"
                            mb={2}>
                            <Button variant='contained' onClick={() => { }}>Add Goalkeeper</Button>
                        </Box>
                        {goalkeeperPerformances.length > 0 ?
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {goalkeeperPerformances.map((gp) => (
                                    <div key={gp.id}>
                                        <ListItem secondaryAction={<>
                                            <RouterLink to={`/match-performance/${gp.id}`}>
                                                <IconButton edge="end" aria-label="delete" sx={{ marginRight: '1px' }}>
                                                    <TbFileChart />
                                                </IconButton>
                                            </RouterLink>
                                            <IconButton edge="end" aria-label="delete" onClick={() => { }}>
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