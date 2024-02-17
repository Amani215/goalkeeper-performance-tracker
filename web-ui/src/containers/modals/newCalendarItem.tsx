import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from '../../contexts/paramsContext';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr'
import { useAddCalendarItemError, useNewCalendarItem } from '../../contexts/calendarContext';


type PropType = {
    calendarID: string,
    modalProp: ModalProp
}
function NewCalendarItem({ calendarID, modalProp }: PropType) {
    const { t } = useTranslation()

    const [_, setError] = useState(false)
    const [teams, setTeams] = useState<string[]>([])

    const newItem = useNewCalendarItem()
    const newItemError = useAddCalendarItemError()

    const paramsContext = useParams()

    useEffect(() => {
        if (paramsContext) {
            paramsContext("teams").then(res => setTeams(res as string[]))
        }
    }, [paramsContext])

    const handleSubmit = async ({ local, visitor, journey }: FormikValues) => {
        if (newItem != null) {
            await newItem({ calendar_id: calendarID, local: local, visitor: visitor, journey: journey })
            if (newItemError) setError(true)
            else modalProp.setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            local: '',
            visitor: '',
            journey: 1
        },
        onSubmit: handleSubmit
    })

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("add_journey")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        label={t("journey")}
                        name="journey"
                        autoComplete="journey"
                        value={formik.values.journey}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.journey && Boolean(formik.errors.journey)}
                        helperText={formik.touched.journey && formik.errors.journey}
                    />

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("local")}</InputLabel>
                        <Select
                            value={formik.values.local}
                            label={t("local")}
                            onChange={(e) => formik.setFieldValue("local", e.target.value)}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("visitor")}</InputLabel>
                        <Select
                            value={formik.values.visitor}
                            label={t("visitor")}
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

export default NewCalendarItem