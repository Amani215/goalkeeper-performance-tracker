import { Box, Card, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdLaunch } from 'react-icons/md'
import { useParams, Link as RouterLink } from 'react-router-dom';
import MatchFeedback from '../components/matchFeedback'
import { useMatchPerformance, useMatchPerformanceError, useMatchPerformanceReady } from '../contexts/matchPerformanceContext';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';

function MatchPerformance() {
    const { id } = useParams();

    const [matchPerformance, setMatchPerformance] = useState<MatchMonitoringDTO | null>(null)
    const [, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const matchPerformanceContext = useMatchPerformance()
    const matchPerformanceReady = useMatchPerformanceReady()
    const matchPerformanceError = useMatchPerformanceError()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (matchPerformanceContext) {
            matchPerformanceContext(id ? id : "").then(
                data => setMatchPerformance(data as MatchMonitoringDTO)
            )
        }

        if (loaded && matchPerformanceReady && matchPerformanceError) {
            setError("No feedback Found.")
        }
        if (loaded && matchPerformanceReady && !matchPerformanceError) {
            setError("")
        }
    }, [loaded, matchPerformanceReady, matchPerformanceError, id])

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                mb={2}>
                <Typography
                    variant='h5'
                    sx={{ fontWeight: "bold" }}
                    align='center'>
                    Goalkeeper Match Performance
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 4, md: 12 }}>
                <Grid item xs={4} sm={4} md={8} order={{ xs: 2, sm: 2, md: 2 }}>
                    <Card sx={{ padding: 2, marginBottom: 1 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <RouterLink to={`/matches/${matchPerformance?.match_id}`}>
                                <IconButton>
                                    <MdLaunch />
                                </IconButton>
                            </RouterLink>
                        </Box>

                        <Grid container columns={8}>
                            <Grid item xs={8}>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}>
                                    Match CA-EST
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Date
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='body1'>
                                    01/01/2022
                                </Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Type
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='body1'>
                                    Amical
                                </Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Category
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='body1'>
                                    CategoryA
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card sx={{ padding: 2 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <RouterLink to={`/goalkeepers/${matchPerformance ? matchPerformance.goalkeeper?.id : ""}`}>
                                <IconButton>
                                    <MdLaunch />
                                </IconButton>
                            </RouterLink>
                        </Box>

                        <Grid container columns={8}>
                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}
                                    mr={2}>
                                    Birthday
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='body1'>
                                    {matchPerformance ? matchPerformance.goalkeeper?.birthday : "--"}
                                </Typography>
                            </Grid>

                            <Grid item xs={8} mb={1}>
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}>
                                    Associated Categories
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={4} sm={4} md={4} order={{ xs: 1, sm: 1, md: 1 }}>
                    <Card sx={{ width: "auto" }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            component="img"
                            sx={{
                                maxHeight: { xs: "100%", sm: "100%", md: 500 },
                                maxWidth: { xs: "100%", sm: "100%", md: 500 },
                            }}
                            alt="Example Goalkeeper"
                            src={"https://pressboxonline.com/wp-content/uploads/2021/01/dan-enos-800x445.jpg"}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            mb={1}>
                            <Typography
                                variant='h6'
                                sx={{ fontWeight: 'bold' }}
                                ml={1} mt={1}>
                                {matchPerformance ? matchPerformance.goalkeeper?.name : "--"}
                            </Typography>
                        </Box>

                    </Card>
                </Grid>
            </Grid>

            <MatchFeedback matchPerformance={matchPerformance} />
        </>
    )
}

export default MatchPerformance