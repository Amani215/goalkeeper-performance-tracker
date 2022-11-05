import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useState } from 'react';
import { useNewCategory, useNewCategoryError } from '../../contexts/categoryContext';
import { ModalProp } from '../../interfaces/modalProp'
import categoryValidationSchema from '../../schemas/categoryValidation';


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

function NewCategory({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [error, setError] = useState(false)

    const newCategory = useNewCategory()
    const newCategoryError = useNewCategoryError()

    const handleSubmit = async ({ name, season }: FormikValues) => {
        if (newCategory != null) {
            await newCategory({ name: name, season: season })
            if (newCategoryError) setError(true)
            else setModalIsOpen()
        }
        console.log(name, season)
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
                    Add a Category
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Category name"
                        name="name"
                        autoComplete="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="season"
                        label="Season (year)"
                        type="season"
                        id="season"
                        autoComplete="season"
                        value={formik.values.season}
                        error={formik.touched.season && Boolean(formik.errors.season)}
                        helperText={formik.touched.season && formik.errors.season}
                        onChange={formik.handleChange}
                    />
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

export default NewCategory