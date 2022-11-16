import React from 'react'
import { Box, Button, FormControlLabel, Modal, Switch, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
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

function UpdateTrainingFeedback({ modalIsOpen, setModalIsOpen }: ModalProp) {

    const handleSubmit = async ({ comment }: FormikValues): Promise<void> => { }

    const formik = useFormik({
        initialValues: {
            absent: false,
            dismissed: false,
            hurt: false,
            with_seniors: false,
            with_national_team: false,
            comment: ""
        },
        onSubmit: handleSubmit
    })
    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update Feedback
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
                                name="absent"
                                onChange={formik.handleChange}
                                checked={formik.values.absent}
                            />
                        }
                        label="Absent"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="dismissed"
                                onChange={formik.handleChange}
                                checked={formik.values.dismissed}
                            />
                        }
                        label="Dismissed"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="hurt"
                                onChange={formik.handleChange}
                                checked={formik.values.hurt}
                            />
                        }
                        label="Hurt"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="with_seniors"
                                onChange={formik.handleChange}
                                checked={formik.values.with_seniors}
                            />
                        }
                        label="With Seniors"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="with_national_team"
                                onChange={formik.handleChange}
                                checked={formik.values.with_national_team}
                            />
                        }
                        label="With National Team"
                    />
                    <TextField
                        margin="normal"
                        size="small"
                        fullWidth
                        id="comment"
                        label="Comment"
                        name="comment"
                        autoComplete="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        autoFocus
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

export default UpdateTrainingFeedback