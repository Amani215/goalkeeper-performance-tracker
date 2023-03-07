import { Box, Button, Grid, Modal, TextField, Typography } from '@mui/material'
import { FormikValues, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useMatchPerformance, useUpdateMatchPerformance } from '../../contexts/matchPerformanceContext';
import { MatchMonitoringDTO, UpdateMatchMonitoringDTO } from '../../DTOs/MatchMonitoringDTO';
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
    const updateMatchPerformance = useUpdateMatchPerformance()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (matchPerformanceContext) {
            setmatchPerformance(matchPerformanceContext)
        }
    }, [loaded, matchPerformanceContext])

    const handleSubmit = async ({
        time_played,
        goals_scored,
        goals_conceded,
        penalties_saved,
        penalties_non_saved,
        balls_touched,
        non_successful_ballon_profondeur,
        non_successful_deliveries,
        non_successful_foot_relaunch,
        non_successful_hand_relaunch,
        successful_ballon_profondeur,
        successful_deliveries,
        successful_foot_relaunch,
        successful_hand_relaunch,
        yellow_cards,
        red_cards,
        grade, comment }: FormikValues): Promise<void> => {
        const newMatchMonitoring: UpdateMatchMonitoringDTO = {
            id: matchPerformance ? matchPerformance.id : "",
            time_played: time_played,
            goals_scored: goals_scored,
            goals_conceded: goals_conceded,
            penalties_saved: penalties_saved,
            penalties_non_saved: penalties_non_saved,
            balls_touched: balls_touched,
            non_successful_ballon_profondeur: non_successful_ballon_profondeur,
            non_successful_deliveries: non_successful_deliveries,
            non_successful_foot_relaunch: non_successful_foot_relaunch,
            non_successful_hand_relaunch: non_successful_hand_relaunch,
            successful_ballon_profondeur: successful_ballon_profondeur,
            successful_deliveries: successful_deliveries,
            successful_foot_relaunch: successful_foot_relaunch,
            successful_hand_relaunch: successful_hand_relaunch,
            yellow_cards: yellow_cards,
            red_cards: red_cards,
            grade: grade,
            comment: comment
        }
        if (updateMatchPerformance) {
            await updateMatchPerformance(newMatchMonitoring)
            setModalIsOpen()
        }
    };

    const formik = useFormik({
        initialValues: {
            time_played: 0,
            goals_scored: 0,
            goals_conceded: 0,
            penalties_saved: 0,
            penalties_non_saved: 0,
            balls_touched: 0,
            non_successful_ballon_profondeur: 0,
            non_successful_deliveries: 0,
            non_successful_foot_relaunch: 0,
            non_successful_hand_relaunch: 0,
            successful_ballon_profondeur: 0,
            successful_deliveries: 0,
            successful_foot_relaunch: 0,
            successful_hand_relaunch: 0,
            yellow_cards: 0,
            red_cards: 0,
            grade: 0,
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
                balls_touched: matchPerformance.balls_touched,
                non_successful_ballon_profondeur: matchPerformance.non_successful_ballon_profondeur,
                non_successful_deliveries: matchPerformance.non_successful_deliveries,
                non_successful_foot_relaunch: matchPerformance.non_successful_foot_relaunch,
                non_successful_hand_relaunch: matchPerformance.non_successful_hand_relaunch,
                successful_ballon_profondeur: matchPerformance.successful_ballon_profondeur,
                successful_deliveries: matchPerformance.successful_deliveries,
                successful_foot_relaunch: matchPerformance.successful_foot_relaunch,
                successful_hand_relaunch: matchPerformance.successful_hand_relaunch,
                yellow_cards: matchPerformance.yellow_cards,
                red_cards: matchPerformance.red_cards,
                grade: matchPerformance.grade,
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
                    />

                    <TextField
                        margin="normal"
                        size="small"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        id="balls_touched"
                        label="Balls Touched"
                        name="balls_touched"
                        autoComplete="balls_touched"
                        value={formik.values.balls_touched}
                        onChange={formik.handleChange}
                        autoFocus
                    />
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
                                id="successful_deliveries"
                                label="Successful Deliveries"
                                name="successful_deliveries"
                                autoComplete="successful_deliveries"
                                value={formik.values.successful_deliveries}
                                onChange={formik.handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="non_successful_deliveries"
                                label="Unsuccessful Deliveries"
                                name="non_successful_deliveries"
                                autoComplete="non_successful_deliveries"
                                value={formik.values.non_successful_deliveries}
                                onChange={formik.handleChange}
                                autoFocus
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
                                id="successful_ballon_profondeur"
                                label="Successful Ballon en Profondeur"
                                name="successful_ballon_profondeur"
                                autoComplete="successful_ballon_profondeur"
                                value={formik.values.successful_ballon_profondeur}
                                onChange={formik.handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="non_successful_ballon_profondeur"
                                label="Unsuccessful Ballon en Profondeur"
                                name="non_successful_ballon_profondeur"
                                autoComplete="non_successful_ballon_profondeur"
                                value={formik.values.non_successful_ballon_profondeur}
                                onChange={formik.handleChange}
                                autoFocus
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
                                id="successful_hand_relaunch"
                                label="Successful Hand Relaunches"
                                name="successful_hand_relaunch"
                                autoComplete="successful_hand_relaunch"
                                value={formik.values.successful_hand_relaunch}
                                onChange={formik.handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="non_successful_hand_relaunch"
                                label="Unsuccessful Hand Relaunches"
                                name="non_successful_hand_relaunch"
                                autoComplete="non_successful_hand_relaunch"
                                value={formik.values.non_successful_hand_relaunch}
                                onChange={formik.handleChange}
                                autoFocus
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
                                id="successful_foot_relaunch"
                                label="Successful Foot Relaunches"
                                name="successful_foot_relaunch"
                                autoComplete="successful_foot_relaunch"
                                value={formik.values.successful_foot_relaunch}
                                onChange={formik.handleChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={8} sm={4}>
                            <TextField
                                margin="normal"
                                size="small"
                                required
                                fullWidth
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                id="non_successful_foot_relaunch"
                                label="Unsuccessful Foot Relaunches"
                                name="non_successful_foot_relaunch"
                                autoComplete="non_successful_foot_relaunch"
                                value={formik.values.non_successful_foot_relaunch}
                                onChange={formik.handleChange}
                                autoFocus
                            />
                        </Grid>
                    </Grid>

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
                    />
                    <TextField
                        margin="normal"
                        size="small"
                        fullWidth
                        id="comment"
                        label="Comment"
                        name="comment"
                        autoComplete="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        autoFocus
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