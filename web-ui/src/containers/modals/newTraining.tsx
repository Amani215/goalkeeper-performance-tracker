import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useCategories, useCategoriesReady } from '../../contexts/categoriesContext';
import { useNewTraining, useNewTrainingError } from '../../contexts/trainingsContext';
import { CategoryDTO } from '../../DTOs/CategoryDTO';
import { ModalProp } from '../../interfaces/modalProp'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2
};

function NewTraining({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [, setError] = useState(false)
    const [categories, setCategories] = useState<CategoryDTO[]>([])

    const newTraining = useNewTraining()
    const newTrainingError = useNewTrainingError()

    const categoriesContext = useCategories()
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
            const trainingDate = dayjs(date).format('DD/MM/YYYY HH:mm').toString()
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
                    Add a Training
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DateTimePicker
                                label="Match Date"
                                inputFormat="MM/DD/YYYY HH:mm"
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
                        label="Duration"
                        name="duration"
                        autoComplete="duration"
                        value={formik.values.duration}
                        onChange={formik.handleChange}
                        autoFocus
                    />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
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
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default NewTraining