import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useTranslation } from 'react-i18next';
import { PlanningDTO } from '../../DTOs/PlanningDTO';
import { useUpdatePlanning } from '../../contexts/planningContext';

type PropType = {
    planning: PlanningDTO | null,
    modalProp: ModalProp
}
function UpdatePlanning({ planning, modalProp }: PropType) {
    const { t } = useTranslation();
    const updatePlanning = useUpdatePlanning()

    dayjs.extend(customParseFormat)
    useEffect(() => {
        if (planning) {
            setDate(dayjs(planning.date, 'DD/MM/YYYY'))
            setType(planning.type)
            setTechniques(planning.techniques)
            setPhysiques(planning.physiques)
            setPsychomotricity(planning.psychomotricity)
            setTactics(planning.tactics)
            setObservation(planning.observation)
        }
    }, [planning])

    // Planning object attributes
    const [date, setDate] = useState<Dayjs>(dayjs())
    const [type, setType] = useState<string>("")
    const [techniques, setTechniques] = useState<string>("")
    const [physiques, setPhysiques] = useState<string>("")
    const [psychomotricity, setPsychomotricity] = useState<string>("")
    const [tactics, setTactics] = useState<string>("")
    const [observation, setObservation] = useState<string>("")

    // Update
    const handleSubmit = async ({ date, type, techniques, physiques, psychomotricity, tactics, observation }: FormikValues) => {
        if (updatePlanning) {
            await updatePlanning(planning ? planning.id : '',
                {
                    date: dayjs(date).format('DD/MM/YYYY').toString(),
                    type: type,
                    techniques: techniques,
                    physiques: physiques,
                    psychomotricity: psychomotricity,
                    tactics: tactics,
                    observation: observation
                })
            modalProp.setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            date: date,
            type: type,
            techniques: techniques,
            physiques: physiques,
            psychomotricity: psychomotricity,
            tactics: tactics,
            observation: observation
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        formik.setValues({ ...{ date, type, techniques, physiques, psychomotricity, tactics, observation } });
    }, [date, type, techniques, physiques, psychomotricity, tactics, observation]);

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("update")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label="Date"
                                inputFormat="DD/MM/YYYY"
                                value={formik.values.date}
                                onChange={v => formik.setFieldValue("date", v)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="type"
                        label={t("type")}
                        name="type"
                        autoComplete="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.type && Boolean(formik.errors.type)}
                        helperText={formik.touched.type && formik.errors.type}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        id="techniques"
                        label={t("techniques")}
                        name="techniques"
                        autoComplete="techniques"
                        value={formik.values.techniques}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.techniques && Boolean(formik.errors.techniques)}
                        helperText={formik.touched.techniques && formik.errors.techniques}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        id="physiques"
                        label={t("physiques")}
                        name="physiques"
                        autoComplete="physiques"
                        value={formik.values.physiques}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.physiques && Boolean(formik.errors.physiques)}
                        helperText={formik.touched.physiques && formik.errors.physiques}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        id="psychomotricity"
                        label={t("psychomotricity")}
                        name="psychomotricity"
                        autoComplete="psychomotricity"
                        value={formik.values.psychomotricity}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.psychomotricity && Boolean(formik.errors.psychomotricity)}
                        helperText={formik.touched.psychomotricity && formik.errors.psychomotricity}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        id="tactics"
                        label={t("tactics")}
                        name="tactics"
                        autoComplete="tactics"
                        value={formik.values.tactics}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.tactics && Boolean(formik.errors.tactics)}
                        helperText={formik.touched.tactics && formik.errors.tactics}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        id="observation"
                        label={t("observation")}
                        name="observation"
                        autoComplete="observation"
                        value={formik.values.observation}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.observation && Boolean(formik.errors.observation)}
                        helperText={formik.touched.observation && formik.errors.observation}
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

export default UpdatePlanning