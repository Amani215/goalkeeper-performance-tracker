import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useNewGrowth } from '../../contexts/growthContext';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr'


type PropType = {
    goalkeeperID: string,
    modalProp: ModalProp
}
function NewGrowth({ goalkeeperID, modalProp }: PropType) {
    const { t, i18n } = useTranslation()
    dayjs.locale(i18n.language);

    const newGrowth = useNewGrowth()

    const [growthDate,] = useState<Dayjs>(
        dayjs(),
    );

    const handleSubmit = async ({ date }: FormikValues) => {
        if (newGrowth != null) {
            const growthDate = dayjs(date).format('DD/MM/YYYY').toString()
            await newGrowth({ goalkeeper_id: goalkeeperID, date: growthDate })
                .then(() => modalProp.setModalIsOpen())
        }
    };

    const formik = useFormik({
        initialValues: {
            date: growthDate
        },
        onSubmit: handleSubmit
    })

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("monitor_growth")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
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

export default NewGrowth