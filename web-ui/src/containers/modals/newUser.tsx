import { Box, Button, Checkbox, FormControlLabel, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { useNewUser, useNewUserError } from '../../contexts/usersContext';
import { ModalProp } from '../../interfaces/modalProp'
import userValidationSchema from '../../schemas/userValidation';
import { style } from './style';
import { useTranslation } from 'react-i18next';

function NewUser({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t } = useTranslation();
    const [, setError] = useState(false)

    const newUser = useNewUser()
    const newUserError = useNewUserError()

    const handleSubmit = async ({ username, password, admin }: FormikValues): Promise<void> => {
        if (newUser != null) {
            await newUser({ username: username, password: password, admin: admin, profile_pic: "" })
            if (newUserError) setError(true)
            else setModalIsOpen()
        }
    };
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            admin: false
        },
        validationSchema: userValidationSchema,
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
                    {t("add_user")}
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
                        label={t("username")}
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
                        label={t("password")}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        onChange={formik.handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={formik.values.admin} />}
                        label="Admin"
                        name="admin"
                        onChange={formik.handleChange}
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

export default NewUser