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
import { GrowthDTO } from '../../DTOs/GrowthDTO';
import { useUpdateGrowth } from '../../contexts/growthContext';
import growthValidationSchema from '../../schemas/growthValidation';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/fr';


type PropType = {
    growth: GrowthDTO | null,
    modalProp: ModalProp
}
function UpdateGrowth({ growth, modalProp }: Readonly<PropType>) {
    const { t, i18n } = useTranslation()
    dayjs.locale(i18n.language);

    const updateGrowth = useUpdateGrowth()

    dayjs.extend(customParseFormat)
    useEffect(() => {
        if (growth) {
            setDate(dayjs(growth.date, 'DD/MM/YYYY'))
            setAnnualGrowth(growth.annual_growth);
            setHeight(growth.height);
            setWeight(growth.weight);
            setTorsoHeight(growth.torso_height);
            setThoracicPerimeter(growth.thoracic_perimeter);
        }
    }, [growth])

    // Match object attributes
    const [date, setDate] = useState<Dayjs>(dayjs())
    const [annualGrowth, setAnnualGrowth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [weight, setWeight] = useState<number>(0)
    const [torsoHeight, setTorsoHeight] = useState<number>(0)
    const [thoracicPerimeter, setThoracicPerimeter] = useState<number>(0)

    // Update
    const handleSubmit = async ({ date, annualGrowth, height, weight, torsoHeight, thoracicPerimeter }: FormikValues) => {
        if (updateGrowth) {
            await updateGrowth(growth ? growth.id : '',
                {
                    date: dayjs(date).format('DD/MM/YYYY').toString(),
                    annual_growth: annualGrowth,
                    height: height,
                    weight: weight,
                    torso_height: torsoHeight,
                    thoracic_perimeter: thoracicPerimeter
                })
            modalProp.setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            date: date,
            annualGrowth: annualGrowth,
            height: height,
            weight: weight,
            torsoHeight: torsoHeight,
            thoracicPerimeter: thoracicPerimeter
        },
        onSubmit: handleSubmit,
        validationSchema: growthValidationSchema
    })

    useEffect(() => {
        formik.setValues({ ...{ date, annualGrowth, height, weight, torsoHeight, thoracicPerimeter } });
    }, [date, annualGrowth, height, weight, torsoHeight, thoracicPerimeter]);

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
                                format="DD/MM/YYYY"
                                value={formik.values.date}
                                onChange={v => formik.setFieldValue("date", v)}
                            />
                        </Stack>
                    </LocalizationProvider>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="annualGrowth"
                        label={t("annual_growth")}
                        name="annualGrowth"
                        autoComplete="annualGrowth"
                        value={formik.values.annualGrowth}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.annualGrowth && Boolean(formik.errors.annualGrowth)}
                        helperText={formik.touched.annualGrowth && formik.errors.annualGrowth}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="height"
                        label={t("height")}
                        name="height"
                        autoComplete="height"
                        value={formik.values.height}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.height && Boolean(formik.errors.height)}
                        helperText={formik.touched.height && formik.errors.height}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="weight"
                        label={t("weight")}
                        name="weight"
                        autoComplete="weight"
                        value={formik.values.weight}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.weight && Boolean(formik.errors.weight)}
                        helperText={formik.touched.weight && formik.errors.weight}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="torsoHeight"
                        label={t("torso_height")}
                        name="torsoHeight"
                        autoComplete="torsoHeight"
                        value={formik.values.torsoHeight}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.torsoHeight && Boolean(formik.errors.torsoHeight)}
                        helperText={formik.touched.torsoHeight && formik.errors.torsoHeight}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="thoracicPerimeter"
                        label={t("thoracic_perimeter")}
                        name="thoracicPerimeter"
                        autoComplete="thoracicPerimeter"
                        value={formik.values.thoracicPerimeter}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.thoracicPerimeter && Boolean(formik.errors.thoracicPerimeter)}
                        helperText={formik.touched.thoracicPerimeter && formik.errors.thoracicPerimeter}
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

export default UpdateGrowth