import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useParams } from '../../contexts/paramsContext';
import { TrainingMonitoringDTO } from '../../DTOs/TrainingMonitoringDTO';
import { useTranslation } from 'react-i18next';
import { useUpdateTrainingPerformance } from '../../contexts/trainingContext';

type PropType = {
    tm: TrainingMonitoringDTO | null,
    modalProp: ModalProp
}
function UpdateAttendance({ tm, modalProp }: PropType) {
    const { t } = useTranslation();
    const updateAttendance = useUpdateTrainingPerformance()

    const [options, setOptions] = useState<string[]>([])

    const paramsContext = useParams()
    useEffect(() => {
        if (paramsContext) {
            paramsContext("attendance").then(res => setOptions(res as string[]))
        }
    }, [paramsContext])

    const handleSubmit = async ({ attendance, attendanceTime }: FormikValues) => {
        if (updateAttendance != null) {
            updateAttendance({
                id: tm ? tm.id : "",
                attendance: attendance,
                attendance_time: attendanceTime
            }).then(() => modalProp.setModalIsOpen())
        }
    };

    const formik = useFormik({
        initialValues: {
            attendance: tm ? tm.attendance : "",
            attendanceTime: tm ? tm.attendance_time : 0
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (tm) {
            formik.setValues({
                attendance: tm.attendance,
                attendanceTime: tm.attendance_time
            }
            );
        }
    }, [tm]);

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("update_attendance")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("attendance")}</InputLabel>
                        <Select
                            required
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.attendance}
                            label="Attendance"
                            onChange={(e) => formik.setFieldValue("attendance", e.target.value)}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="attendanceTime"
                        label={t("attendance_time")}
                        name="attendanceTime"
                        autoComplete="attendanceTime"
                        value={formik.values.attendanceTime}
                        onChange={formik.handleChange}
                        autoFocus
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

export default UpdateAttendance