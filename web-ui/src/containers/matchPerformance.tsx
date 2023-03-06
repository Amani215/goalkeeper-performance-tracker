import { Box, Chip, Grid, Link, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { IoFootball } from 'react-icons/io5';
import { useParams, Link as RouterLink } from 'react-router-dom';
import MatchFeedback from '../components/matchFeedback'
import { useGoalkeeperCategories, useGoalkeeperCategoriesReady } from '../contexts/goalkeeperContext';
import { useGetMatchPerformance, useMatchPerformanceError, useMatchPerformanceReady } from '../contexts/matchPerformanceContext';
import { CategoryDTO } from '../DTOs';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { ModalProp } from '../interfaces/modalProp';

function MatchPerformance({ setModalIsOpen }: ModalProp) {
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
                    component={RouterLink}
                    to={`/matches/${matchPerformance?.match?.id}`}
                    variant='h5'
                    sx={{ fontWeight: "bold", textDecoration: 'none', color: "black" }}
                    align='center'>
                    {matchPerformance?.match?.match_type} {matchPerformance?.match?.local}-{matchPerformance?.match?.visitor} {matchPerformance?.match?.date}

                </Typography>
                <Typography
                    variant='h6'
                    align='center'>
                    {matchPerformance?.match?.category.name} {matchPerformance?.match?.category.season}
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 12 }}>
                <Grid item xs={4} sm={8} md={8} order={{ xs: 2, sm: 2, md: 2 }}>
                    <MatchFeedback matchPerformance={matchPerformance} setModalIsOpen={setModalIsOpen} />
                </Grid>
                <Grid item xs={4} sm={4} md={4} order={{ xs: 1, sm: 1, md: 1 }}>
                    <Box
                        component={RouterLink}
                        to={`/goalkeepers/${matchPerformance ? matchPerformance.goalkeeper?.id : ""}`}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ textDecoration: "none", color: "black" }}
                        mb={1}>
                        <Box
                            component="img"
                            sx={{
                                borderRadius: "50%",
                                height: "12rem",
                                width: "12rem",
                            }}
                            src={matchPerformance ? matchPerformance.goalkeeper?.picture : `${process.env.PUBLIC_URL}/assets/placeholder.png`}
                        />
                        <Typography
                            variant='h6'
                            sx={{ fontWeight: 'bold' }}
                            mt={1}>
                            {matchPerformance ? matchPerformance.goalkeeper?.name : "--"}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center">
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
        </>
    )
}

export default MatchPerformance