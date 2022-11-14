import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Stack, TextField, Typography } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useCategories, useCategoriesReady } from '../../contexts/categoriesContext';
import { useNewMatch, useNewMatchError } from '../../contexts/matchesContext';
import { CategoryDTO } from '../../DTOs';
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

function NewMatch({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [, setError] = useState(false)
    const [categories, setCategories] = useState<CategoryDTO[]>([])

    const newMatch = useNewMatch()
    const newMatchError = useNewMatchError()

    const categoriesContext = useCategories()
    const categoriesReady = useCategoriesReady()

    const [matchDtae,] = useState<Dayjs>(
        dayjs(),
    );

    useEffect(() => {
        if (categoriesReady && categoriesContext) {
            setCategories(categoriesContext)
        }
    }, [categoriesReady, categoriesContext])

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
            date: matchDtae,
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
                                inputFormat="MM/DD/YYYY"
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
                        name="local"
                        label="Local Team"
                        type="local"
                        id="local"
                        autoComplete="local"
                        value={formik.values.local}
                        error={formik.touched.local && Boolean(formik.errors.local)}
                        helperText={formik.touched.local && formik.errors.local}
                        onChange={formik.handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="visitor"
                        label="Visitor Team"
                        type="visitor"
                        id="visitor"
                        autoComplete="visitor"
                        value={formik.values.visitor}
                        error={formik.touched.visitor && Boolean(formik.errors.visitor)}
                        helperText={formik.touched.visitor && formik.errors.visitor}
                        onChange={formik.handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="matchType"
                        label="Match Type"
                        type="matchType"
                        id="matchType"
                        autoComplete="matchType"
                        value={formik.values.matchType}
                        error={formik.touched.matchType && Boolean(formik.errors.matchType)}
                        helperText={formik.touched.matchType && formik.errors.matchType}
                        onChange={formik.handleChange}
                    />

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