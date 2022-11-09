import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNewCategoryTrainer } from '../../contexts/categoryContext';
import { useUsers, useUsersReady } from '../../contexts/usersContext';
import { UserDTO } from '../../DTOs';
import { ModalProp } from '../../interfaces/modalProp'

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

function NewCategoryCoach({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { id } = useParams();

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
                    Add a Coach
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
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default NewCategoryCoach