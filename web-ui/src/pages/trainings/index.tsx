import { Box, TextField } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'
import { GrafanaPanel } from '../../components/grafana'
import NewTraining from '../../containers/modals/newTraining'
import PortalPage from '../../containers/portalPage'
import TrainingsView from '../../containers/trainingsView'
import CategoriesProvider from '../../contexts/categoriesContext'
import TrainingsProvider from '../../contexts/trainingsContext'

function Trainings() {
    const [date, setDate] = useState<Dayjs>(dayjs())


    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const handleOpen = () => setModalIsOpen(true)
    const handleClose = () => setModalIsOpen(false)

    return (
        <TrainingsProvider>
            <CategoriesProvider>
                <NewTraining {...{ modalIsOpen, setModalIsOpen: handleClose }} />
            </CategoriesProvider>

            <PortalPage>
                <TrainingsView {...{ modalIsOpen, setModalIsOpen: handleOpen }} />

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                    mb={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            views={['year', 'month']}
                            label="Year and Month"
                            minDate={dayjs('01/01/2012', 'DD/MM/YYYY')}
                            maxDate={dayjs('01/12/2050', 'DD/MM/YYYY')}
                            value={date}
                            onChange={(v) => {
                                setDate(dayjs(v, "MM/DD/YYYY"))
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </LocalizationProvider>
                </Box>

                <GrafanaPanel src={`http://localhost/grafana/d-solo/trainLite/trainings?from=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + ".01").getTime())}&to=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + "." + date.daysInMonth()).getTime())}&orgId=1&panelId=12`} xs={12} height={600} />
            </PortalPage>
        </TrainingsProvider>
    )
}

export default Trainings