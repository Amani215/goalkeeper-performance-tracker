import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
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

type PropType = {
    categoryID: string,
    modalProp: ModalProp
}
function NewPlanning({ categoryID, modalProp }: PropType) {
    const { t } = useTranslation();

    const newPlanning = useNewPlanning()

    const [planningDate,] = useState<Dayjs>(
        dayjs(),
    );

    const handleSubmit = async ({ date, type }: FormikValues) => {
        if (newPlanning != null) {
            const planningDate = dayjs(date).format('DD/MM/YYYY').toString()
            await newPlanning({ category_id: categoryID, date: planningDate, type: type })
                .then(() => modalProp.setModalIsOpen())
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

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label="Date"
                                inputFormat="DD/MM/YYYY"
                                value={formik.values.date}
                                onChange={v => formik.setFieldValue("date", v)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="type"
                        label={t("type")}
                        name="type"
                        autoComplete="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.type && Boolean(formik.errors.type)}
                        helperText={formik.touched.type && formik.errors.type}
                    />

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