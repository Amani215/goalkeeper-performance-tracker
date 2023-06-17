import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMatch, useMatchError, useMatchReady, useUpdateScores } from '../../contexts/matchContext';
import { ModalProp } from '../../interfaces/modalProp'
import { style } from './style';
import { useTranslation } from 'react-i18next';

function UpdateScore({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const { t } = useTranslation();
    const [, setError] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const match = useMatch()
    const matchError = useMatchError()
    const matchReady = useMatchReady()
    const updateScores = useUpdateScores()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )
    const [matchID, setMatchID] = useState("")
    const [localScore, setLocalScore] = useState<number>(0)
    const [visitorScore, setVisitorScore] = useState<number>(0)
    const [result, setResult] = useState("")

    useEffect(() => {
        if (match) {
            setError(false)
            setMatchID(match.id)
            setLocalScore(match.score_local)
            setVisitorScore(match.score_visitor)
            setResult(match.result)
        }

        if (loaded && matchReady && matchError) {
            setError(true)
        }
    }, [loaded, match])

    const handleSubmit = async ({ localScore, visitorScore, result }: FormikValues): Promise<void> => {
        if (updateScores) {
            await updateScores(matchID, localScore, visitorScore, result)
            setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            localScore: localScore,
            visitorScore: visitorScore,
            result: result,
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (visitorScore >= 0 && localScore >= 0 && result != "") {
            formik.setValues({
                ...{ localScore, visitorScore, result }
            });
        }
    }, [localScore, visitorScore, result]);

    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
            aria-labelledby="set-scores-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {t("update_scores")}
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            id="localScore"
                            label={`${match?.local} Score`}
                            name="localScore"
                            autoComplete="localScore"
                            value={formik.values.localScore}
                            onChange={formik.handleChange}
                            autoFocus
                            error={formik.touched.localScore && Boolean(formik.errors.localScore)}
                            helperText={formik.touched.localScore && formik.errors.localScore}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            id="visitorScore"
                            label={`${match?.visitor} Score`}
                            name="visitorScore"
                            autoComplete="visitorScore"
                            value={formik.values.visitorScore}
                            onChange={formik.handleChange}
                            autoFocus
                            error={formik.touched.visitorScore && Boolean(formik.errors.visitorScore)}
                            helperText={formik.touched.visitorScore && formik.errors.visitorScore}
                        />
                    </Box>

                    <FormControl fullWidth sx={{ marginBottom: 1, marginTop: 1 }}>
                        <InputLabel id="update-match-result-label">{t("result")}</InputLabel>
                        <Select
                            labelId="select-match-result-label"
                            id="match-result-select"
                            value={formik.values.result}
                            label={t("local")}
                            onChange={(e) => formik.setFieldValue("result", e.target.value)}
                        >
                            <MenuItem key="victory" value="victory">{t("victory")}</MenuItem>
                            <MenuItem key="defeat" value="defeat">{t("defeat")}</MenuItem>
                            <MenuItem key="v" value="draw">{t("draw")}</MenuItem>
                        </Select>
                    </FormControl>

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

export default UpdateScore