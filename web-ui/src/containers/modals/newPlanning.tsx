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

type PropType = {
    categoryID: string,
    modalProp: ModalProp
}
function NewPlanning({ categoryID, modalProp }: Readonly<PropType>) {
    const { t, i18n } = useTranslation()
    dayjs.locale(i18n.language);

    const [types, setTypes] = useState<string[]>([])
    const [error, setError] = useState<string>("")
    const planningDate = dayjs()

    const newPlanning = useNewPlanning()
    const paramsContext = useParams()

    useEffect(() => {
        if (paramsContext) {
            paramsContext("planning_types").then(res => setTypes(res as string[]))
        }
    }, [paramsContext])


    const handleSubmit = async ({ date, type }: FormikValues) => {
        if (newPlanning != null) {
            const planningDate = dayjs(date).format('DD/MM/YYYY').toString()
            await newPlanning({ category_id: categoryID, date: planningDate, type: type })
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
            date: planningDate,
            type: ""
        },
        onSubmit: handleSubmit
    })

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="new_planning-title"
            aria-describedby=""
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("add_planning")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    {error != "" ?
                        <Alert severity='error' sx={{ marginBottom: 2 }}>{t("user_not_allowed")}</Alert>
                        : <></>}
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label="Date"
                                format="DD/MM/YYYY"
                                value={formik.values.date}
                                onChange={v => formik.setFieldValue("date", v)}
                            />
                        </Stack>
                    </LocalizationProvider>

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

export default NewPlanning