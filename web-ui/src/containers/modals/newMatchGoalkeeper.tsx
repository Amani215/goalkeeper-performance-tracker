import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGoalkeepers, useGoalkeepersReady } from '../../contexts/goalkeepersContext';
import { useNewMatchGoalkeeper } from '../../contexts/matchContext';
import { GoalkeeperDTO } from '../../DTOs/GoalkeeperDTO';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next'

function NewMatchGoalkeeper({ modalIsOpen, setModalIsOpen }: Readonly<ModalProp>) {
    const { id } = useParams();
    const { t } = useTranslation();

    const [goalkeepers, setGoalkeepers] = useState<GoalkeeperDTO[]>([] as GoalkeeperDTO[])

    const goalkeepersReady = useGoalkeepersReady()
    const goalkeepersContext = useGoalkeepers()
    const newMatchGoalkeeper = useNewMatchGoalkeeper()

    useEffect(() => {
        if (goalkeepersReady && goalkeepersContext) {
            setGoalkeepers(goalkeepersContext)
        }
    }, [goalkeepersReady, goalkeepersContext])

    const handleSubmit = async ({ goalkeeperId }: FormikValues): Promise<void> => {
        if (goalkeeperId == "")
            return;

        if (newMatchGoalkeeper) {
            await newMatchGoalkeeper(goalkeeperId, id as string)
            setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            goalkeeperId: ''
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
                    {t("add_goalkeeper")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">{t("goalkeeper")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formik.values.goalkeeperId}
                            label="Goalkeeper"
                            onChange={(e) => formik.setFieldValue("goalkeeperId", e.target.value)}
                        >
                            {goalkeepers.map((goalkeeper) => (
                                <MenuItem key={goalkeeper.id} value={goalkeeper.id}>{goalkeeper.name}</MenuItem>
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

export default NewMatchGoalkeeper