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

    const [birthdayDate, setBirthdayDate] = useState<Dayjs>(
        dayjs('2014-08-18T21:11:54'),
    );

    const handleSubmit = async ({ name, birthday }: FormikValues): Promise<void> => {
        if (newGoalkeeper != null) {
            setBirthdayDate(birthday)

            await newGoalkeeper({
                name: name, day: birthdayDate.toDate().getDay(),
                month: birthdayDate.toDate().getMonth(), year: birthdayDate.toDate().getFullYear()
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label="Birth Date"
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
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default NewGoalkeeper