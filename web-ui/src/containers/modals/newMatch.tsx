import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useCategories, useCategoriesReady } from '../../contexts/categoriesContext';
import { useNewMatch, useNewMatchError } from '../../contexts/matchesContext';
import { useParams } from '../../contexts/paramsContext';
import { CategoryDTO } from '../../DTOs';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';

function NewMatch({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [_, setError] = useState(false)
    const [teams, setTeams] = useState<string[]>([])
    const [matchTypes, setMatchTypes] = useState<string[]>([])
    const [categories, setCategories] = useState<CategoryDTO[]>([])

    const newMatch = useNewMatch()
    const newMatchError = useNewMatchError()

    const paramsContext = useParams()
    const categoriesContext = useCategories()
    const categoriesReady = useCategoriesReady()

    const [matchDate,] = useState<Dayjs>(
        dayjs(),
    );

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
            if (newMatchError) setError(true)
            else setModalIsOpen()
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
                    Add a Match
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
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default NewMatch