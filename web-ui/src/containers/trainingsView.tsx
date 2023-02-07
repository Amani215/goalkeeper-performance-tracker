import { TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import React, { useState } from 'react'
import { GrafanaPanel } from '../components/grafana'
import { ModalProp } from '../interfaces/modalProp'

function TrainingsView({ setModalIsOpen }: ModalProp) {
    const [date, setDate] = useState<Dayjs>(dayjs())

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

                <Box
                    mb={{ xs: 2 }}
                    ml={{ sm: 2 }}
                >
                    <Button
                        variant="contained"
                        onClick={() => { setModalIsOpen() }}
                    >Add Training
                    </Button>
                </Box>
            </Box>

            <GrafanaPanel src={`http://localhost/grafana/d-solo/trainLite/trainings?from=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + ".01").getTime())}&to=${Math.floor(new Date(date.year().toString() + "." + (date.month() + 1).toString() + "." + date.daysInMonth()).getTime())}&orgId=1&panelId=12`} xs={12} height={600} />
        </>
    )
}

export default TrainingsView