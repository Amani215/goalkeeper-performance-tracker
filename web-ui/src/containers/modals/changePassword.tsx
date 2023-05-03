import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { ModalProp } from '../../interfaces/modalProp'
import categoryValidationSchema from '../../schemas/categoryValidation';
import { style } from './style';
import { useParams } from '../../contexts/paramsContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useUpdateUserPassword } from '../../contexts/userContext';
import { useAuth } from '../../contexts/authContext';

function ChangePassword({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t } = useTranslation()
    const [_, setError] = useState(false)

    const auth = useAuth()
    const changePassword = useUpdateUserPassword()
    const handleSubmit = async ({ password }: FormikValues) => {
        if (changePassword) {
            await changePassword(auth ? auth.user.id : "", password).then(
                () => setModalIsOpen()
            )
        }
    };

    const formik = useFormik({
        initialValues: {
            password: ''
        },
        onSubmit: handleSubmit
    })

    return (
        <Modal
            open={modalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Change Password
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
                        id="password"
                        label={t("password")}
                        name="password"
                        type="password"
                        autoComplete="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
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

export default ChangePassword