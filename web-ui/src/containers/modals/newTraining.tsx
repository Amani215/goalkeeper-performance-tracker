import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useNonArchivedCategories, useCategoriesReady } from '../../contexts/categoriesContext';
import { useNewTraining, useNewTrainingError } from '../../contexts/trainingsContext';
import { CategoryDTO } from '../../DTOs/CategoryDTO';
import { ModalProp } from '../../interfaces/modalProp'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { style } from './style';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr'

function NewTraining({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t, i18n } = useTranslation()
    dayjs.locale(i18n.language);

    const [, setError] = useState(false)
    const [categories, setCategories] = useState<CategoryDTO[]>([])

    const newTraining = useNewTraining()
    const newTrainingError = useNewTrainingError()

    const categoriesContext = useNonArchivedCategories()
    const categoriesReady = useCategoriesReady()

    const [trainingDate,] = useState<Dayjs>(
        dayjs(),
    );

    useEffect(() => {
        if (categoriesReady && categoriesContext) {
            setCategories(categoriesContext)
        }
    }, [categoriesReady, categoriesContext])

    const handleSubmit = async ({ date, duration, category }: FormikValues) => {
        if (newTraining != null) {
            const trainingDate = dayjs(date).format('DD/MM/YYYY').toString()
            await newTraining(trainingDate, duration, category)
            if (newTrainingError) setError(true)
            else setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            date: trainingDate,
            duration: 0,
            category: ""
        },
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
                    {t("add_training")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
                        <Stack spacing={3}>
                            <DatePicker
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
                        size="small"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="duration"
                        label={t("duration")}
                        name="duration"
                        autoComplete="duration"
                        value={formik.values.duration}
                        onChange={formik.handleChange}
                        autoFocus
                    />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{t("category")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.category}
                            label="Category"
                            onChange={(e) => formik.setFieldValue("category", e.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name} {category.season}</MenuItem>
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

export default NewTraining