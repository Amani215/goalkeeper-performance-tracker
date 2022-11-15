import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetTraining, useTrainingError, useTrainingReady } from '../contexts/trainingContext';
import { TrainingDTO } from '../DTOs/TrainingDTO';

function TrainingDetails() {
    const { id } = useParams();

    const [training, setTraining] = useState<TrainingDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const trainingContext = useGetTraining()
    const trainingError = useTrainingError()
    const trainingReady = useTrainingReady()

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
                </Box>}
        </>
    )
}

export default TrainingDetails