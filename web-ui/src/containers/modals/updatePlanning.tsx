import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
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
import { useParams } from '../../contexts/paramsContext';
import 'dayjs/locale/fr';

type PropType = {
    planning: PlanningDTO | null,
    modalProp: ModalProp
}
function UpdatePlanning({ planning, modalProp }: Readonly<PropType>) {
    const { t, i18n } = useTranslation()
    dayjs.locale(i18n.language);

    // Init Dropdown lists
    const [types, setTypes] = useState<string[]>([])
    const [techniquesList, setTechniquesList] = useState<string[]>([])
    const [physiquesList, setPhysiquesList] = useState<string[]>([])
    const [psychomotricityList, setPsychomotricityList] = useState<string[]>([])
    const [tacticsList, setTacticsList] = useState<string[]>([])

    const paramsContext = useParams()
    useEffect(() => {
        if (paramsContext) {
            paramsContext("planning_types").then(res => setTypes(res as string[]))
            paramsContext("techniques").then(res => setTechniquesList(res as string[]))
            paramsContext("physiques").then(res => setPhysiquesList(res as string[]))
            paramsContext("psychomotricity").then(res => setPsychomotricityList(res as string[]))
            paramsContext("tactics").then(res => setTacticsList(res as string[]))
        }
    }, [paramsContext])

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

                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
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

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("planning_type")}</InputLabel>
                        <Select
                            value={formik.values.type}
                            label={t("planning_type")}
                            onChange={(e) => formik.setFieldValue("type", e.target.value)}
                        >
                            {types.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("techniques")}</InputLabel>
                        <Select
                            value={formik.values.techniques}
                            label={t("techniques")}
                            onChange={(e) => formik.setFieldValue("techniques", e.target.value)}
                        >
                            <MenuItem key="none" value={""}></MenuItem>
                            {techniquesList.map((techniques) => (
                                <MenuItem key={techniques} value={techniques}>{techniques}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("physiques")}</InputLabel>
                        <Select
                            value={formik.values.physiques}
                            label={t("physiques")}
                            onChange={(e) => formik.setFieldValue("physiques", e.target.value)}
                        >
                            {physiquesList.map((physiques) => (
                                <MenuItem key={physiques} value={physiques}>{physiques}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("psychomotricity")}</InputLabel>
                        <Select
                            value={formik.values.psychomotricity}
                            label={t("psychomotricity")}
                            onChange={(e) => formik.setFieldValue("psychomotricity", e.target.value)}
                        >
                            {psychomotricityList.map((psychomotricity) => (
                                <MenuItem key={psychomotricity} value={psychomotricity}>{psychomotricity}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel>{t("tactics")}</InputLabel>
                        <Select
                            value={formik.values.tactics}
                            label={t("tactics")}
                            onChange={(e) => formik.setFieldValue("tactics", e.target.value)}
                        >
                            {tacticsList.map((tactics) => (
                                <MenuItem key={tactics} value={tactics}>{tactics}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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