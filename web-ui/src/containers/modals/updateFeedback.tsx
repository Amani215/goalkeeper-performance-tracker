import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMatchPerformance } from '../../contexts/matchPerformanceContext';
import { MatchMonitoringDTO } from '../../DTOs/MatchMonitoringDTO';
import { ModalProp } from '../../interfaces/modalProp'


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflowY: 'scroll'
};

function UpdateFeedback({ modalIsOpen, setModalIsOpen }: ModalProp) {
    const [loaded, setLoaded] = useState(false)

    const [matchPerformance, setmatchPerformance] = useState<MatchMonitoringDTO | null>(null)
    const matchPerformanceContext = useMatchPerformance()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (matchPerformanceContext) {
            setmatchPerformance(matchPerformanceContext)
        }
    }, [loaded, matchPerformanceContext])

    const handleSubmit = async ({ time_played, goals_scored }: FormikValues): Promise<void> => {
        console.log(time_played, goals_scored)
    };

    const formik = useFormik({
        initialValues: {
            time_played: 0,
            goals_scored: 0,
            goals_conceded: 0,
            penalties_saved: 0,
            penalties_non_saved: 0,
            yellow_cards: 0,
            red_cards: 0,
            grade: 0,
            assets: "",
            flaws: "",
            comment: ""
        },
        onSubmit: handleSubmit
    })

    useEffect(() => {
        if (matchPerformance) {
            formik.setValues({
                time_played: matchPerformance.time_played,
                goals_scored: matchPerformance.goals_scored,
                goals_conceded: matchPerformance.goals_conceded,
                penalties_saved: matchPerformance.penalties_saved,
                penalties_non_saved: matchPerformance.penalties_non_saved,
                yellow_cards: matchPerformance.yellow_cards,
                red_cards: matchPerformance.red_cards,
                grade: matchPerformance.grade,
                assets: matchPerformance.assets,
                flaws: matchPerformance.flaws,
                comment: matchPerformance.comment
            }
            );
        }
    }, [matchPerformance]);

    return (
        <Modal
            open={modalIsOpen}
            onClose={setModalIsOpen}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Update Feedback
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="time_played"
                        label="Time Played"
                        name="time_played"
                        autoComplete="time_played"
                        value={formik.values.time_played}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.time_played && Boolean(formik.errors.time_played)}
                        helperText={formik.touched.time_played && formik.errors.time_played}
                    />

                    <Grid container spacing={{ sm: 1 }} columns={{ xs: 8, sm: 8 }}>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="goals_scored"
                                label="Goals Scored"
                                name="goals_scored"
                                autoComplete="goals_scored"
                                value={formik.values.goals_scored}
                                onChange={formik.handleChange}
                                autoFocus
                                error={formik.touched.goals_scored && Boolean(formik.errors.goals_scored)}
                                helperText={formik.touched.goals_scored && formik.errors.goals_scored}
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="goals_conceded"
                                label="Goals Conceded"
                                name="goals_conceded"
                                autoComplete="goals_conceded"
                                value={formik.values.goals_conceded}
                                onChange={formik.handleChange}
                                autoFocus
                                error={formik.touched.goals_conceded && Boolean(formik.errors.goals_conceded)}
                                helperText={formik.touched.goals_conceded && formik.errors.goals_conceded}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={{ sm: 1 }} columns={{ xs: 8, sm: 8 }}>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="penalties_saved"
                                label="Penalties Saved"
                                name="penalties_saved"
                                autoComplete="penalties_saved"
                                value={formik.values.penalties_saved}
                                onChange={formik.handleChange}
                                autoFocus
                                error={formik.touched.penalties_saved && Boolean(formik.errors.penalties_saved)}
                                helperText={formik.touched.penalties_saved && formik.errors.penalties_saved}
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="penalties_non_saved"
                                label="Penalties Non Saved"
                                name="penalties_non_saved"
                                autoComplete="penalties_non_saved"
                                value={formik.values.penalties_non_saved}
                                onChange={formik.handleChange}
                                autoFocus
                                error={formik.touched.penalties_non_saved && Boolean(formik.errors.penalties_non_saved)}
                                helperText={formik.touched.penalties_non_saved && formik.errors.penalties_non_saved}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={{ sm: 1 }} columns={{ xs: 8, sm: 8 }}>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="yellow_cards"
                                label="Yellow Cards"
                                name="yellow_cards"
                                autoComplete="yellow_cards"
                                value={formik.values.yellow_cards}
                                onChange={formik.handleChange}
                                autoFocus
                                error={formik.touched.yellow_cards && Boolean(formik.errors.yellow_cards)}
                                helperText={formik.touched.yellow_cards && formik.errors.yellow_cards}
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="red_cards"
                                label="Red Cards"
                                name="red_cards"
                                autoComplete="red_cards"
                                value={formik.values.red_cards}
                                onChange={formik.handleChange}
                                autoFocus
                                error={formik.touched.red_cards && Boolean(formik.errors.red_cards)}
                                helperText={formik.touched.red_cards && formik.errors.red_cards}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        id="assets"
                        label="Assets"
                        name="assets"
                        autoComplete="assets"
                        value={formik.values.assets}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.assets && Boolean(formik.errors.assets)}
                        helperText={formik.touched.assets && formik.errors.assets}
                    />
                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        id="flaws"
                        label="Flaws"
                        name="flaws"
                        autoComplete="flaws"
                        value={formik.values.flaws}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.flaws && Boolean(formik.errors.flaws)}
                        helperText={formik.touched.flaws && formik.errors.flaws}
                    />
                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="grade"
                        label="Grade"
                        name="grade"
                        autoComplete="grade"
                        value={formik.values.grade}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.grade && Boolean(formik.errors.grade)}
                        helperText={formik.touched.grade && formik.errors.grade}
                    />
                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        id="comment"
                        label="Comment"
                        name="comment"
                        autoComplete="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        autoFocus
                        error={formik.touched.comment && Boolean(formik.errors.comment)}
                        helperText={formik.touched.comment && formik.errors.comment}
                    />
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

export default UpdateFeedback