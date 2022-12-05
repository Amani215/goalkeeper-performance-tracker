import React, { useEffect, useState } from 'react'
import { Box, Button, FormControlLabel, Modal, Switch, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { UserDTO } from '../../DTOs/UserDTO';
import { useUpdateUserStatus, useUser } from '../../contexts/userContext';

function UpdateUser({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [loaded, setLoaded] = useState(false)

    const [user, setUser] = useState<UserDTO | null>(null)
    const userContext = useUser()
    const updateUserStatus = useUpdateUserStatus()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (userContext) {
            setUser(userContext)
        }
    }, [loaded, userContext])

    const handleSubmit = async ({ admin }: FormikValues): Promise<void> => {
        if (updateUserStatus && user) {
            await updateUserStatus(user.username, admin)
            setModalIsOpen()
        }
    }

    const formik = useFormik({
        initialValues: {
            admin: false,
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (user) {
            formik.setValues({
                admin: user.admin,
            }
            );
        }
    }, [user]);

    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update User Status
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default UpdateUser