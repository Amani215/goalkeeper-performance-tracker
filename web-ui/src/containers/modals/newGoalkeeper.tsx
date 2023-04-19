import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { useNewGoalkeeper, useNewGoalkeeperError } from '../../contexts/goalkeepersContext';
import { ModalProp } from '../../interfaces/modalProp'
import goalkeeperValidationSchema from '../../schemas/goalkeeperValidation';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { style } from './style';
import { useTranslation } from 'react-i18next';

function NewGoalkeeper({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t } = useTranslation()
    const [error, setError] = useState(false)

    const newGoalkeeper = useNewGoalkeeper()
    const newGoalkeeperError = useNewGoalkeeperError()

    const [birthdayDate, setBirthdayDate] = useState<Dayjs>(
        dayjs('2014-08-18T21:11:54'),
    );

    const handleSubmit = async ({ name, birthday }: FormikValues): Promise<void> => {
        if (newGoalkeeper != null) {
            await newGoalkeeper({
                name: name, day: birthday['$D'],
                month: birthday['$d'].getMonth() + 1, year: birthday.toDate().getFullYear()
            })
            if (newGoalkeeperError) setError(true)
            else setModalIsOpen()
        }
    };
    const formik = useFormik({
        initialValues: {
            name: '',
            birthday: birthdayDate
        },
        validationSchema: goalkeeperValidationSchema,
        onSubmit: handleSubmit
    })

    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("add_goalkeeper")}
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
                        id="name"
                        label={t("name")}
                        name="name"
                        autoComplete="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label={t("birthdate")}
                                inputFormat="MM/DD/YYYY"
                                value={formik.values.birthday}
                                onChange={v => formik.setFieldValue("birthday", v)}
                                maxDate={dayjs()}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </LocalizationProvider>

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

export default NewGoalkeeper