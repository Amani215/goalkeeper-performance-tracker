import { Box, Card, Chip, Grid, IconButton, Link, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { IoFootball } from 'react-icons/io5';
import { MdLaunch } from 'react-icons/md'
import { useParams, Link as RouterLink } from 'react-router-dom';
import MatchFeedback from '../components/matchFeedback'
import { useGoalkeeperCategories, useGoalkeeperCategoriesReady } from '../contexts/goalkeeperContext';
import { useGetMatchPerformance, useMatchPerformanceError, useMatchPerformanceReady } from '../contexts/matchPerformanceContext';
import { CategoryDTO } from '../DTOs';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';

function MatchPerformance() {
    const { id } = useParams();

    const [matchPerformance, setMatchPerformance] = useState<MatchMonitoringDTO | null>(null)
    const [, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const matchPerformanceContext = useGetMatchPerformance()
    const matchPerformanceReady = useMatchPerformanceReady()
    const matchPerformanceError = useMatchPerformanceError()

    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const goalkeeperCategoriesContext = useGoalkeeperCategories()
    const goalkeeperCategoriesReady = useGoalkeeperCategoriesReady()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (matchPerformanceContext) {
            matchPerformanceContext(id ? id : "").then(
                data => {
                    setMatchPerformance(data as MatchMonitoringDTO)
                }
            )
        }

        if (loaded && matchPerformanceReady && matchPerformanceError) {
            setError("No feedback Found.")
        }
        if (loaded && matchPerformanceReady && !matchPerformanceError) {
            setError("")
        }

        if (goalkeeperCategoriesContext) {
            goalkeeperCategoriesContext(matchPerformance ? matchPerformance.goalkeeper?.id : "").then((data) => {
                if (goalkeeperCategoriesReady)
                    setCategories(data as CategoryDTO[])
            })
        }
    }, [loaded, matchPerformanceReady, matchPerformanceError, id, goalkeeperCategoriesReady])

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
                            <RouterLink to={`/matches/${matchPerformance?.match?.id}`}>
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
                                    Match {matchPerformance?.match?.local}-{matchPerformance?.match?.visitor}
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
                                    {matchPerformance?.match?.date}
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
                                    {matchPerformance?.match?.match_type}
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
                                    {matchPerformance?.match?.category?.id}
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
                                <Box display="flex" flexDirection="row">
                                    <Typography
                                        variant='subtitle1'
                                        sx={{ fontWeight: 'bold' }}
                                        mr={1}>
                                        Associated Categories
                                    </Typography>
                                    {categories.length > 0 ?
                                        categories.map((category) => (
                                            <Grid item xs={4} md={3}
                                                key={category.id}
                                                mb={1}
                                            >
                                                <Link
                                                    component={RouterLink}
                                                    to={`/categories/${category.id}`}
                                                    underline="none"
                                                    color="inherit">
                                                    <Chip
                                                        icon={<IoFootball />}
                                                        label={`${category?.name} ${category?.season}`}
                                                        onClick={() => { }} />
                                                </Link>
                                            </Grid>
                                        ))
                                        : <Box pl={1}>
                                            No associated categories yet.
                                        </Box>}
                                </Box>
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