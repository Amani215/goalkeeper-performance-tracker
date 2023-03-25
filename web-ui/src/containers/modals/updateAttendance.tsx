import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useParams } from '../../contexts/paramsContext';
import { useUpdateTrainingPerformance } from '../../contexts/trainingPerformanceContext';
import { TrainingMonitoringDTO } from '../../DTOs/TrainingMonitoringDTO';

type PropType = {
    tm: TrainingMonitoringDTO | null,
    modalProp: ModalProp
}
function UpdateAttendance({ tm, modalProp }: PropType) {
    const updateAttendance = useUpdateTrainingPerformance()

    const [options, setOptions] = useState<string[]>([])

    const paramsContext = useParams()
    useEffect(() => {
        if (paramsContext) {
            paramsContext("attendance").then(res => setOptions(res as string[]))
        }
    }, [paramsContext])

    const handleSubmit = async ({ attendance }: FormikValues) => {
        if (updateAttendance != null) {
            updateAttendance({
                id: tm ? tm.id : "",
                attendance: attendance
            }).then(() => modalProp.setModalIsOpen())
        }
    };

    const formik = useFormik({
        initialValues: {
            attendance: tm ? tm.attendance : "",
        },
        onSubmit: handleSubmit
    })

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update Attendance
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">Category name</InputLabel>
                        <Select
                            required
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.attendance}
                            label="Local"
                            onChange={(e) => formik.setFieldValue("attendance", e.target.value)}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

export default UpdateAttendance