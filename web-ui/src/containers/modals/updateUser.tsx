import React, { useEffect, useState } from 'react'
import { Box, Button, FormControlLabel, Modal, Switch, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { UserDTO } from '../../DTOs/UserDTO';
import { useUpdateUserArchive, useUpdateUserStatus, useUser } from '../../contexts/userContext';
import { useTranslation } from 'react-i18next';

function UpdateUser({ modalIsOpen, setModalIsOpen }: Readonly<ModalProp>) {
    const { t } = useTranslation();
    const [loaded, setLoaded] = useState(false)

    const [user, setUser] = useState<UserDTO | null>(null)
    const userContext = useUser()
    const updateUserStatus = useUpdateUserStatus()
    const updateUserArchived = useUpdateUserArchive()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (userContext) {
            setUser(userContext)
        }
    }, [loaded, userContext])

    const handleSubmit = async ({ admin, archived, archiveReason }: FormikValues): Promise<void> => {
        if (updateUserStatus && updateUserArchived && user) {
            await updateUserStatus(user.username, admin)
            await updateUserArchived(user.username, archived, archiveReason)
            setModalIsOpen()
        }
    }

    const formik = useFormik({
        initialValues: {
            admin: false,
            archived: false,
            archiveReason: ""
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (user) {
            formik.setValues({
                admin: user.admin,
                archived: user.archived ? user.archived : false,
                archiveReason: user.archive_reason ? user.archive_reason : ""
            });
        }
    }, [user]);

    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("update_user_status")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                    display="flex"
                    flexDirection="column"
                >
                    <FormControlLabel
                        control={
                            <Switch
                                name="admin"
                                onChange={formik.handleChange}
                                checked={formik.values.admin}
                            />
                        }
                        label="Admin"
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                name="archived"
                                onChange={formik.handleChange}
                                checked={formik.values.archived}
                            />
                        }
                        label={t("archived")}
                    />

                    {formik.values.archived ?
                        <TextField
                            margin="normal"
                            fullWidth
                            id="archiveReason"
                            label={t("archive_reason")}
                            name="archiveReason"
                            autoComplete="archiveReason"
                            value={formik.values.archiveReason}
                            onChange={formik.handleChange}
                            autoFocus
                            error={formik.touched.archiveReason && Boolean(formik.errors.archiveReason)}
                            helperText={formik.touched.archiveReason && formik.errors.archiveReason}
                        />
                        : <></>
                    }

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

export default UpdateUser