import React from 'react'
import { Box, Button, Card, Grid, Typography } from '@mui/material'
import { MatchMonitoringDTO } from '../../DTOs/MatchMonitoringDTO'

type PropType = {
    matchPerformance: MatchMonitoringDTO | null
}
function MatchFeedback({ matchPerformance }: PropType) {
    return (
        <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 4, md: 12 }}>
            <Grid item xs={4} sm={4} md={8} order={{ xs: 1, sm: 1, md: 1 }}>
                <Card sx={{ marginTop: 2 }}>
                    <Box
                        display="flex" flexDirection="row" justifyContent="center"
                        alignItems="center">

                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold' }}
                            mr={2}>
                            Grade
                        </Typography>
                        <Typography variant='h6'>
                            {matchPerformance ? matchPerformance.grade : "--"}
                        </Typography>


                    </Box>
                </Card>
                <Card sx={{ width: "100%", marginTop: 2, padding: 2 }}>
                    <Box
                        display="flex" justifyContent="flex-end">
                        <Button>Update Feedback</Button>
                    </Box>
                    <Grid container columns={8}>
                        <Grid item xs={8}>
                            <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 'bold' }}>
                                Feedback
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography
                                variant='subtitle1'>
                                Time Played
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography
                                variant='subtitle1'>
                                {matchPerformance ? matchPerformance.time_played : "--"} min
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography
                                variant='subtitle1'>
                                Assets
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography
                                variant='subtitle1'>
                                {matchPerformance ? matchPerformance.assets : "--"}
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography
                                variant='subtitle1'>
                                Weaknesses
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography
                                variant='subtitle1'>
                                {matchPerformance ? matchPerformance.flaws : "--"}
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography
                                variant='subtitle1'>
                                Comment
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography
                                variant='subtitle1'>
                                {matchPerformance ? matchPerformance.comment : "--"}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={4} sm={4} md={4} order={{ xs: 2, sm: 2, md: 2 }}>
                <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 12, sm: 4 }}>
                    <Grid item xs={6} sm={2}>
                        <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                p={2}
                            >
                                <Typography variant='h3'>
                                    {matchPerformance ? matchPerformance.goals_conceded : "--"}
                                </Typography>
                                <Typography
                                    variant='h6'
                                    align='center'
                                    sx={{ fontStyle: 'Bold' }}
                                    mt={1}>
                                    Goals Conceded
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                p={2}
                            >
                                <Typography variant='h3'>
                                    {matchPerformance ? matchPerformance.goals_scored : "--"}
                                </Typography>
                                <Typography
                                    variant='h6'
                                    align='center'
                                    sx={{ fontStyle: 'Bold' }}
                                    mt={1}>
                                    Goals Scored
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                p={2}
                            >
                                <Typography variant='h3'>
                                    {matchPerformance ? matchPerformance.penalties_saved : "--"}
                                </Typography>
                                <Typography
                                    variant='h6'
                                    align='center'
                                    sx={{ fontStyle: 'Bold' }}
                                    mt={1}>
                                    Penalties Saved
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                p={2}
                            >
                                <Typography variant='h3'>
                                    {matchPerformance ? matchPerformance.penalties_non_saved : "--"}
                                </Typography>
                                <Typography
                                    variant='h6'
                                    align='center'
                                    sx={{ fontStyle: 'Bold' }}
                                    mt={1}>
                                    Penalties Non Saved
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default MatchFeedback