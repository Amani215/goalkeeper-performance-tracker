import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next';
import { useNewPlanning } from '../../contexts/planningContext';
import { useParams } from '../../contexts/paramsContext';
import 'dayjs/locale/fr'
import { useNewCalendar } from '../../contexts/calendarContext';

type PropType = {
    categoryID: string,
    modalProp: ModalProp
}
function NewCalendar({ categoryID, modalProp }: PropType) {
    const { t, i18n } = useTranslation()
    dayjs.locale(i18n.language);

    const [types, setTypes] = useState<string[]>([])
    const [teams, setTeams] = useState<string[]>([])
    const [error, setError] = useState<string>("")

    const newCalendar = useNewCalendar()
    const paramsContext = useParams()

    useEffect(() => {
        if (paramsContext) {
            paramsContext("teams").then(res => setTeams(res as string[]))
            paramsContext("planning_types").then(res => setTypes(res as string[]))
        }
    }, [paramsContext])


    const handleSubmit = async ({ type, journey, local, visitor }: FormikValues) => {
        if (newCalendar != null) {
            await newCalendar({
                category_id: categoryID, calendar_type: type,
                journey: journey,
                local: local,
                visitor: visitor
            })
                .then(() => {
                    modalProp.setModalIsOpen()
                })
                .catch(data => {
                    setError(data)
                    console.log(data)
                })
        }
    };

    const formik = useFormik({
        initialValues: {
            date: "",
            type: "",
            journey: 0,
            local: "",
            visitor: ""
        },
        onSubmit: handleSubmit
    })

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="new_calendar-title"
            aria-describedby=""
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("add_calendar")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    {error != "" ?
                        <Alert severity='error' sx={{ marginBottom: 2 }}>{t("user_not_allowed")}</Alert>
                        : <></>}
                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("planning_type")}</InputLabel>
                        <Select
                            value={formik.values.type}
                            label={t("planning_type")}
                            required
                            onChange={(e) => formik.setFieldValue("type", e.target.value)}
                        >
                            {types.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("local")}</InputLabel>
                        <Select
                            value={formik.values.local}
                            label={t("local")}
                            required
                            onChange={(e) => formik.setFieldValue("local", e.target.value)}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("visitor")}</InputLabel>
                        <Select
                            value={formik.values.visitor}
                            label={t("visitor")}
                            required
                            onChange={(e) => formik.setFieldValue("visitor", e.target.value)}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {t("add")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default NewCalendar