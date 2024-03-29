import { Box, Chip, Grid, Link, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { IoFootball } from 'react-icons/io5';
import { useParams, Link as RouterLink } from 'react-router-dom';
import MatchFeedback from '../components/matchFeedback'
import { useGoalkeeperCategories, useGoalkeeperCategoriesReady } from '../contexts/goalkeeperContext';
import { useGetMatchPerformance, useGetMatchSequences, useMatchPerformanceError, useMatchPerformanceReady, useMatchSequencesReady, useMatchSequencesUpdated } from '../contexts/matchPerformanceContext';
import { CategoryDTO } from '../DTOs';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { ModalProp } from '../interfaces/modalProp';
import { MatchSequenceDTO } from '../DTOs/MatchSequenceDTO';
import SequencesList from '../containers/sequencesList';
import { useTranslation } from 'react-i18next'

function MatchPerformance({ setModalIsOpen }: Readonly<ModalProp>) {
    const { id } = useParams();
    const { t } = useTranslation();

    const [matchPerformance, setMatchPerformance] = useState<MatchMonitoringDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const matchPerformanceContext = useGetMatchPerformance()
    const matchPerformanceReady = useMatchPerformanceReady()
    const matchPerformanceError = useMatchPerformanceError()

    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const goalkeeperCategoriesContext = useGoalkeeperCategories()
    const goalkeeperCategoriesReady = useGoalkeeperCategoriesReady()

    const [sequences, setSequences] = useState<MatchSequenceDTO[]>([])
    const matchSequencesContext = useGetMatchSequences()
    const matchSequencesReady = useMatchSequencesReady()
    const matchSequencesUpdated = useMatchSequencesUpdated()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (matchPerformanceContext) {
            matchPerformanceContext(id ?? "").then(
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

    useEffect(() => {
        if (matchSequencesContext) {
            matchSequencesContext(id ?? "").then(
                data => {
                    setSequences(data as MatchSequenceDTO[])
                }
            )
        }
    }, [loaded, matchPerformanceError, matchSequencesReady, matchSequencesUpdated])

    return (
        <>
            {error != "" ?
                <Typography
                    variant='subtitle2'
                    ml={1} mt={1}>
                    {error}
                </Typography>
                :
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
                            {matchPerformance?.match?.match_type} {matchPerformance?.match?.date}

                        </Typography>
                        <Typography
                            variant='h6'
                            align='center'>
                            {matchPerformance?.match?.category.name} {matchPerformance?.match?.category.season}
                        </Typography>
                        <Typography
                            variant='h6'
                            align='center'
                            sx={{ fontWeight: "bold", textDecoration: 'none', color: "black" }}>
                            {matchPerformance?.match?.local} {matchPerformance?.match?.score_local} -  {matchPerformance?.match?.score_visitor} {matchPerformance?.match?.visitor}
                        </Typography>
                    </Box>

                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 12 }}>
                        <Grid item xs={4} sm={6} md={6} order={{ xs: 2, sm: 2, md: 2 }}>
                            <MatchFeedback matchPerformance={matchPerformance} setModalIsOpen={setModalIsOpen} />
                        </Grid>
                        <Grid item xs={4} sm={6} md={6} order={{ xs: 1, sm: 1, md: 1 }}>
                            {/* GOALKEEPER SECTION */}
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
                                    {matchPerformance ? `${matchPerformance.goalkeeper?.name} (${matchPerformance.goalkeeper_order})` : "--"}
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
                                        {t("no_categories")}
                                    </Box>}
                            </Box>

                            {/* MATCH SEQUENCES SECTION */}
                            <SequencesList sequences={sequences} />
                        </Grid>
                    </Grid>
                </>
            }
        </>
    )
}

export default MatchPerformance