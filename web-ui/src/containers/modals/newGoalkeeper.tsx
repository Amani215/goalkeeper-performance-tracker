import { Box, Button, Checkbox, FormControlLabel, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { useNewGoalkeeper, useNewGoalkeeperError } from '../../contexts/goalkeepersContext';
import { useNewUser, useNewUserError } from '../../contexts/usersContext';
import { ModalProp } from '../../interfaces/modalProp'
import goalkeeperValidationSchema from '../../schemas/goalkeeperValidation';
import userValidationSchema from '../../schemas/userValidation';


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

function NewGoalkeeper({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [error, setError] = useState(false)

    const newGoalkeeper = useNewGoalkeeper()
    const newGoalkeeperError = useNewGoalkeeperError()

    const handleSubmit = async ({ name, day, month, year }: FormikValues): Promise<void> => {
        if (newGoalkeeper != null) {
            await newGoalkeeper({ name: name, day: day, month: month, year: year })
            if (newGoalkeeperError) setError(true)
            else setModalIsOpen()
        }
    };
    const formik = useFormik({
        initialValues: {
            name: '',
            day: 1,
            month: 1,
            year: 1970
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
                    Add a Goalkeeper
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
                        label="Name"
                        name="name"
                        autoComplete="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="day"
                        label="Day"
                        type="day"
                        id="day"
                        autoComplete="day"
                        value={formik.values.day}
                        error={formik.touched.day && Boolean(formik.errors.day)}
                        helperText={formik.touched.day && formik.errors.day}
                        onChange={formik.handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="month"
                        label="Month"
                        type="month"
                        id="month"
                        autoComplete="month"
                        value={formik.values.month}
                        error={formik.touched.month && Boolean(formik.errors.month)}
                        helperText={formik.touched.month && formik.errors.month}
                        onChange={formik.handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="year"
                        label="Year"
                        type="year"
                        id="year"
                        autoComplete="year"
                        value={formik.values.year}
                        error={formik.touched.year && Boolean(formik.errors.year)}
                        helperText={formik.touched.year && formik.errors.year}
                        onChange={formik.handleChange}
                    />
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

export default NewGoalkeeper