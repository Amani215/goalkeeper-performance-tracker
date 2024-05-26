import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import { ModalProp } from '../interfaces/modalProp'
import { useTranslation } from 'react-i18next'
import TrainingsList from '../components/trainingsList'
import { TrainingDTO } from '../DTOs/TrainingDTO'
import { useTrainingAdded, useTrainingDeleted, useTrainings } from '../contexts/trainingsContext'
import { useTrainingError, useTrainingReady } from '../contexts/trainingContext'
import { useAuth } from '../contexts/authContext'
import { Typography } from '@mui/material'

function TrainingsView({ setModalIsOpen }: Readonly<ModalProp>) {
    const { t } = useTranslation();
    const auth = useAuth()

    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const [trainings, setTrainings] = useState<TrainingDTO[]>([])
    const trainingsContext = useTrainings()
    const trainingsError = useTrainingError()
    const trainingsReady = useTrainingReady()
    const trainingAdded = useTrainingAdded()
    const trainingDeleted = useTrainingDeleted()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (trainingsContext) {
            trainingsContext().then(
                data => setTrainings(data as TrainingDTO[])
            )
        }
        if (loaded && trainingsReady && trainingsError) {
            setError("No trainings Found.")
        }
        if (loaded && trainingsReady && !trainingsError) {
            setError("")
        }
    }, [loaded, trainingsReady, trainingsError, trainingAdded, trainingDeleted])

    return (
        <>
            {error != "" ?
                <Typography
                    variant='subtitle2'
                    ml={1} mt={1}>
                    {error}
                </Typography>
                :
                <>
                    {auth?.user.admin ?
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            mb={3}>
                            <Button
                                variant="contained"
                                onClick={() => { setModalIsOpen() }}
                            >{t("add_training")}
                            </Button>
                        </Box> : <></>
                    }
                    <TrainingsList trainings={trainings} />
                    {/* <GrafanaPanel src={`${process.env.REACT_APP_GRAFANA_ENDPOINT}/d-solo/trainLite/trainings?from=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + ".01").getTime())}&to=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + "." + date.daysInMonth()).getTime())}&orgId=1&panelId=12`} xs={12} height={600} /> */}
                </>
            }</>
    )
}

export default TrainingsView