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

type PropType = {
    growth: GrowthDTO | null,
    modalProp: ModalProp
}
function UpdateGrowth({ growth, modalProp }: PropType) {
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
        onSubmit: handleSubmit
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
                    Update
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

export default UpdateGrowth