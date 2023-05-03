import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next';
import { useUpdateUserPassword } from '../../contexts/userContext';
import { useAuth } from '../../contexts/authContext';
import passwordValidation from '../../schemas/passwordValidation';

function ChangePassword({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t } = useTranslation()

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
            password: "",
            confirmPassword: ""
        },
        onSubmit: handleSubmit,
        validationSchema: passwordValidation
    })

    return (
        <Modal
            open={modalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("update_password")}
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

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="confirmPassword"
                        label={t("confirm_password")}
                        name="confirmPassword"
                        type="password"
                        autoComplete="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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