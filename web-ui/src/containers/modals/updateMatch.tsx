import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useCategories } from '../../contexts/categoriesContext';
import { useParams } from '../../contexts/paramsContext';
import { CategoryDTO } from '../../DTOs';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useUpdateMatch } from '../../contexts/matchContext';
import { MatchDTO } from '../../DTOs/MatchDTO';
import customParseFormat from 'dayjs/plugin/customParseFormat'

type PropType = {
    match: MatchDTO | null,
    modalProp: ModalProp
}
function UpdateMatch({ match, modalProp }: PropType) {
    const updateMatch = useUpdateMatch()

    dayjs.extend(customParseFormat)
    useEffect(() => {
        if (match) {
            setDate(dayjs(match.date, 'DD/M/YYYY'))
            setLocal(match.local)
            setVisitor(match.visitor)
            setMatchType(match.match_type)
            setCategory(match.category.id)
        }
    }, [match])

    // Match object attributes
    const [date, setDate] = useState<Dayjs>(dayjs())
    const [local, setLocal] = useState<string>('')
    const [visitor, setVisitor] = useState<string>('')
    const [matchType, setMatchType] = useState<string>('')
    const [category, setCategory] = useState<string>('')

    // Categories list
    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const categoriesContext = useCategories()
    useEffect(() => {
        if (categoriesContext) {
            setCategories(categoriesContext)
        }
    }, [categoriesContext])

    // Teams and match type lists
    const [teams, setTeams] = useState<string[]>([])
    const [matchTypes, setMatchTypes] = useState<string[]>([])
    const paramsContext = useParams()
    useEffect(() => {
        if (paramsContext) {
            paramsContext("teams").then(res => setTeams(res as string[]))
            paramsContext("match_types").then(res => setMatchTypes(res as string[]))
        }
    }, [paramsContext])

    // Update
    const handleSubmit = async ({ date, local, visitor, matchType, category }: FormikValues) => {
        if (updateMatch) {
            await updateMatch(match ? match.id : '',
                {
                    date: dayjs(date).format('DD/MM/YYYY').toString(),
                    local: local,
                    visitor: visitor,
                    match_type: matchType,
                    category_id: category
                })
            modalProp.setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            date: date,
            local: local,
            visitor: visitor,
            matchType: matchType,
            category: category
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        formik.setValues({ ...{ date, local, visitor, matchType, category } });
    }, [date, local, visitor, matchType, category]);

    return (
        <Modal
            open={modalProp.modalIsOpen}
            onClose={modalProp.setModalIsOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update Match
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3}>
                            <DesktopDatePicker
                                label="Match Date"
                                inputFormat="DD/MM/YYYY"
                                value={formik.values.date}
                                onChange={v => formik.setFieldValue("date", v)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">Local Team</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.local}
                            label="Local"
                            onChange={(e) => formik.setFieldValue("local", e.target.value)}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <InputLabel id="demo-simple-select-label">Visitor Team</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.visitor}
                            label="Visitor"
                            onChange={(e) => formik.setFieldValue("visitor", e.target.value)}
                        >
                            {teams.map((team) => (
                                <MenuItem key={team} value={team}>{team}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginBottom: 1 }}>
                        <InputLabel id="demo-simple-select-label">Match Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.matchType}
                            label="matchType"
                            onChange={(e) => formik.setFieldValue("matchType", e.target.value)}
                        >
                            {matchTypes.map((matchType) => (
                                <MenuItem key={matchType} value={matchType}>{matchType}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.category}
                            label="Category"
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
                        Update
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default UpdateMatch