import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { ModalProp } from '../interfaces/modalProp'
import { useTranslation } from 'react-i18next'
import TrainingsList from '../components/trainingsList'
import { TrainingDTO } from '../DTOs/TrainingDTO'
import { useTrainingAdded, useTrainingDeleted, useTrainings } from '../contexts/trainingsContext'
import { useTrainingError, useTrainingReady } from '../contexts/trainingContext'

function TrainingsView({ setModalIsOpen }: ModalProp) {
    const { t } = useTranslation();
    const [date, setDate] = useState<Dayjs>(dayjs())
    const [_, setError] = useState("")
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
            <Box
                display="flex"
                justifyContent={{ xs: 'center', sm: 'space-between' }}
                alignItems={{ xs: 'center', sm: "baseline" }}
                sx={{ flexWrap: 'wrap-reverse' }}
                mb={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        views={['year', 'month']}
                        label={t("year_and_month")}
                        minDate={dayjs('01/01/2012', 'DD/MM/YYYY')}
                        maxDate={dayjs('01/12/2050', 'DD/MM/YYYY')}
                        value={date}
                        onChange={(v) => {
                            setDate(dayjs(v, "MM/DD/YYYY"))
                        }}
                        renderInput={(params) => <TextField {...params} helperText={null} />}
                    />
                </LocalizationProvider>

                <Box
                    mb={{ xs: 2 }}
                    ml={{ sm: 2 }}
                >
                    <Button
                        variant="contained"
                        onClick={() => { setModalIsOpen() }}
                    >{t("add_training")}
                    </Button>
                </Box>
            </Box>

            <TrainingsList trainings={trainings} />
            {/* <GrafanaPanel src={`http://localhost/grafana/d-solo/trainLite/trainings?from=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + ".01").getTime())}&to=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + "." + date.daysInMonth()).getTime())}&orgId=1&panelId=12`} xs={12} height={600} /> */}
        </>
    )
}

export default TrainingsView