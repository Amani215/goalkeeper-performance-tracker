import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next';
import { GoalkeeperDTO } from '../../DTOs/GoalkeeperDTO';
import { useGoalkeeper, useUpdateGoalkeeper } from '../../contexts/goalkeeperContext';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function UpdateGoalkeeper({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false)

    const [goalkeeper, setGoalkeeper] = useState<GoalkeeperDTO | null>(null)
    const goalkeeperContext = useGoalkeeper()
    const updateGoalkeeper = useUpdateGoalkeeper()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (goalkeeperContext) {
            setGoalkeeper(goalkeeperContext as unknown as GoalkeeperDTO)
        }
    }, [loaded, goalkeeperContext])

    const handleSubmit = async ({ birthday, phone }: FormikValues): Promise<void> => {
        if (updateGoalkeeper && goalkeeper) {
            await updateGoalkeeper(goalkeeper.id, dayjs(birthday).format('DD/MM/YYYY').toString(), phone)
            setModalIsOpen()
        }
    }

    const formik = useFormik({
        initialValues: {
            birthday: '',
            phone: ''
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (goalkeeper) {
            formik.setValues({
                birthday: dayjs(goalkeeper.birthday).format("DD/MM/YYYY").toString(),
                phone: goalkeeper.phone
            }
            );
        }
    }, [goalkeeper]);

    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("update_goalkeeper")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                    display="flex"
                    flexDirection="column"
                >

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label={t("birthdate")}
                                inputFormat="DD/MM/YYYY"
                                value={formik.values.birthday}
                                onChange={v => formik.setFieldValue("birthday", v)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label={t("phone")}
                        name="phone"
                        autoComplete="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {t("update")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default UpdateGoalkeeper