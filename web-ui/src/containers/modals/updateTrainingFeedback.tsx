import React, { useEffect, useState } from 'react'
import { Box, Button, FormControlLabel, Modal, Switch, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { ModalProp } from '../../interfaces/modalProp'
import { TrainingMonitoringDTO, UpdateTrainingMonitoringDTO } from '../../DTOs/TrainingMonitoringDTO';
import { useTrainingPerformance, useUpdateTrainingPerformance } from '../../contexts/trainingPerformanceContext';
import { style } from './style';

function UpdateTrainingFeedback({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [loaded, setLoaded] = useState(false)

    const [trainingPerformance, setTrainingPerformance] = useState<TrainingMonitoringDTO | null>(null)
    const trainingPerformanceContext = useTrainingPerformance()
    const updateTrainingPerformance = useUpdateTrainingPerformance()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (trainingPerformanceContext) {
            setTrainingPerformance(trainingPerformanceContext)
        }
    }, [loaded, trainingPerformanceContext])

    const handleSubmit = async ({ absent, dismissed, hurt, with_seniors, with_national_team, comment }: FormikValues): Promise<void> => {
        const newTrainingMonitoring: UpdateTrainingMonitoringDTO = {
            id: trainingPerformance ? trainingPerformance.id : "",
            absent: absent,
            dismissed: dismissed,
            hurt: hurt,
            with_seniors: with_seniors,
            with_national_team: with_national_team,
            comment: comment
        }
        if (updateTrainingPerformance) {
            await updateTrainingPerformance(newTrainingMonitoring)
            setModalIsOpen()
        }
    }

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

    useEffect(() => {
        if (trainingPerformance) {
            formik.setValues({
                absent: trainingPerformance.absent,
                dismissed: trainingPerformance.dismissed,
                hurt: trainingPerformance.hurt,
                with_seniors: trainingPerformance.with_seniors,
                with_national_team: trainingPerformance.with_national_team,
                comment: trainingPerformance.comment
            }
            );
        }
    }, [trainingPerformance]);

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