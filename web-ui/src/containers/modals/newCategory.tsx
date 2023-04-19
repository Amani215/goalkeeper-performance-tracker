import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNewCategory, useNewCategoryError } from '../../contexts/categoriesContext';
import { ModalProp } from '../../interfaces/modalProp'
import categoryValidationSchema from '../../schemas/categoryValidation';
import { style } from './style';
import { useParams } from '../../contexts/paramsContext';
import { useTranslation } from 'react-i18next';

function NewCategory({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t } = useTranslation()
    const [_, setError] = useState(false)

    const newCategory = useNewCategory()
    const newCategoryError = useNewCategoryError()

    const [names, setNames] = useState<string[]>([])
    const [seasons, setSeasons] = useState<string[]>([])

    const paramsContext = useParams()
    useEffect(() => {
        if (paramsContext) {
            paramsContext("category_names").then(res => setNames(res as string[]))
            paramsContext("seasons").then(res => setSeasons(res as string[]))
        }
    }, [paramsContext])

    const handleSubmit = async ({ name, season }: FormikValues) => {
        if (newCategory != null) {
            await newCategory({ name: name, season: season })
            if (newCategoryError) setError(true)
            else setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            season: ''
        },
        validationSchema: categoryValidationSchema,
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
                    {t("add_category")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("category_name")}</InputLabel>
                        <Select
                            required
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.name}
                            label={t("local")}
                            onChange={(e) => formik.setFieldValue("name", e.target.value)}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">{t("season")}</InputLabel>
                        <Select
                            required
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.season}
                            label={t("season")}
                            onChange={(e) => formik.setFieldValue("season", e.target.value)}
                        >
                            {seasons.map((season) => (
                                <MenuItem key={season} value={season}>{season}</MenuItem>
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

export default NewCategory