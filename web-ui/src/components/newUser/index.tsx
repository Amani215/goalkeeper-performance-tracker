import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { useNewUser, useNewUserError } from '../../contexts/userContext';
import { ModalProp } from '../../interfaces/modalProp'
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

function NewUser({
    modalIsOpen,
    setModalIsOpen
}: ModalProp) {
    const [error, setError] = useState(false)

    const newUser = useNewUser()
    const newUserError = useNewUserError()

    const handleSubmit = async ({ username, password }: FormikValues): Promise<void> => {
        if (newUser != null) {
            await newUser("", username, password, false, "")
            if (newUserError) setError(true)
            console.log("called")
        }

    };
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: userValidationSchema,
        onSubmit: handleSubmit
    })

    if (!modalIsOpen) return (<></>)
    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add a User
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
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
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

export default NewUser