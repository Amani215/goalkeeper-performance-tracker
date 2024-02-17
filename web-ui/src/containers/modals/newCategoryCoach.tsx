import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNewCategoryTrainer } from '../../contexts/categoryContext';
import { useUsers, useUsersReady } from '../../contexts/usersContext';
import { UserDTO } from '../../DTOs';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next';


function NewCategoryCoach({ modalIsOpen, setModalIsOpen }: Readonly<ModalProp>) {
    const { id } = useParams();
    const { t } = useTranslation();

    const [coaches, setCoaches] = useState<UserDTO[]>([] as UserDTO[])

    const usersReady = useUsersReady()
    const users = useUsers()
    const newCategoryTrainer = useNewCategoryTrainer()

    useEffect(() => {
        if (usersReady && users) {
            setCoaches(users)
        }
    }, [usersReady, users])

    const handleSubmit = async ({ userId }: FormikValues): Promise<void> => {
        if (userId == "")
            return;

        if (newCategoryTrainer != null) {
            await newCategoryTrainer(userId, id as string)
            setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            userId: ''
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
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    {t("add_coach")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Coach</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.userId}
                            label="Coach"
                            onChange={(e) => formik.setFieldValue("userId", e.target.value)}
                        >
                            {coaches.map((coach) => (
                                coach.admin ?
                                    <div key={coach.id}></div> :
                                    <MenuItem key={coach.id} value={coach.id}>{coach.username}</MenuItem>
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

export default NewCategoryCoach