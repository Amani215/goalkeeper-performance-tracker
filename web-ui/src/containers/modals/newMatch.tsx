import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNonArchivedCategories, useCategoriesReady } from '../../contexts/categoriesContext';
import { useNewMatch, useNewMatchError } from '../../contexts/matchesContext';
import { useParams } from '../../contexts/paramsContext';
import { CategoryDTO } from '../../DTOs';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr'


function NewMatch({ modalIsOpen, setModalIsOpen }: Readonly<ModalProp>) {
    const { t, i18n } = useTranslation()
    dayjs.locale(i18n.language);

    const [teams, setTeams] = useState<string[]>([])
    const [matchTypes, setMatchTypes] = useState<string[]>([])
    const [categories, setCategories] = useState<CategoryDTO[]>([])

    const newMatch = useNewMatch()
    const newMatchError = useNewMatchError()

    const paramsContext = useParams()
    const categoriesContext = useNonArchivedCategories()
    const categoriesReady = useCategoriesReady()

    const matchDate = dayjs()

    useEffect(() => {
        if (categoriesReady && categoriesContext) {
            setCategories(categoriesContext)
        }
    }, [categoriesReady, categoriesContext])

    useEffect(() => {
        if (paramsContext) {
            paramsContext("teams").then(res => setTeams(res as string[]))
            paramsContext("match_types").then(res => setMatchTypes(res as string[]))
        }
    }, [paramsContext])

    const handleSubmit = async ({ date, local, visitor, matchType, category }: FormikValues) => {
        if (newMatch != null) {
            const matchDate = dayjs(date).format('DD/MM/YYYY').toString()
            await newMatch({ date: matchDate, local: local, visitor: visitor, match_type: matchType, category_id: category })
            if (!newMatchError) setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            date: matchDate,
            local: '',
            visitor: '',
            matchType: '',
            category: ''
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
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("add_match")}
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
                        <InputLabel id="demo-simple-select-label">{t("local")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.local}
                            label={t("local")}
                            onChange={(e) => formik.setFieldValue("local", e.target.value)}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("visitor")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.visitor}
                            label={t("visitor")}
                            onChange={(e) => formik.setFieldValue("visitor", e.target.value)}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("match_type")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.matchType}
                            label={t("match_type")}
                            onChange={(e) => formik.setFieldValue("matchType", e.target.value)}
                        >
                            {matchTypes.map((matchType) => (
                                <MenuItem key={matchType} value={matchType}>{matchType}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{t("category")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.category}
                            label={t("category")}
                            onChange={(e) => formik.setFieldValue("category", e.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name} {category.season}</MenuItem>
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

export default NewMatch