import { Box, Button, Card, Chip, Grid, IconButton, Link, Typography } from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { MdLaunch } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { TiDeleteOutline } from 'react-icons/ti'
import { BsCheckCircle } from 'react-icons/bs'
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO';
import { CategoryDTO } from '../DTOs';
import { useGoalkeeperCategories, useGoalkeeperCategoriesReady } from '../contexts/goalkeeperContext';
import { useGetTrainingPerformance, useTrainingPerformanceError, useTrainingPerformanceReady, useTrainingPerformanceUpdated, useUpdateTrainingForm } from '../contexts/trainingPerformanceContext';
import { IoFootball } from 'react-icons/io5';
import { ModalProp } from '../interfaces/modalProp';


function TrainingPerformance({ setModalIsOpen }: ModalProp) {
    const { id } = useParams();

    const [trainingPerformance, setTrainingPerformance] = useState<TrainingMonitoringDTO | null>(null)
    const [, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const trainingPerformanceContext = useGetTrainingPerformance()
    const trainingPerformanceReady = useTrainingPerformanceReady()
    const trainingPerformanceError = useTrainingPerformanceError()
    const trainingPerformanceUpdated = useTrainingPerformanceUpdated()

    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const goalkeeperCategoriesContext = useGoalkeeperCategories()
    const goalkeeperCategoriesReady = useGoalkeeperCategoriesReady()

    const updateTrainingForm = useUpdateTrainingForm()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (trainingPerformanceContext) {
            trainingPerformanceContext(id ? id : "").then(
                data => {
                    setTrainingPerformance(data as TrainingMonitoringDTO)
                }
            )
        }

        if (loaded && trainingPerformanceReady && trainingPerformanceError) {
            setError("No feedback Found.")
        }
        if (loaded && trainingPerformanceReady && !trainingPerformanceError) {
            setError("")
        }

        if (goalkeeperCategoriesContext) {
            goalkeeperCategoriesContext(trainingPerformance ? trainingPerformance.goalkeeper?.id : "").then((data) => {
                if (goalkeeperCategoriesReady)
                    setCategories(data as CategoryDTO[])
            })
        }
    }, [loaded, trainingPerformanceReady, trainingPerformanceUpdated, trainingPerformanceError, id, goalkeeperCategoriesReady])

    const uploadTrainingForm = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const formdata = new FormData()
            formdata.append("training_form", e.target.files[0])
            if (updateTrainingForm) {
                updateTrainingForm(id ? id : "", formdata).then((data) => { console.log(data) })
            }
            console.log(e.target.files[0])
        }
    }

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
                    Goalkeeper Training Performance
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 4, md: 12 }}>
                <Grid item xs={4} sm={4} md={4} order={{ xs: 1, sm: 1, md: 1 }}>
                    <Card sx={{ width: "auto", height: "100%" }}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center">
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                component="img"
                                sx={{
                                    maxHeight: { xs: "100%", sm: "100%", md: "32rem" },
                                    maxWidth: { xs: "100%", sm: "100%", md: "32rem" },
                                }}
                                alt="Example Goalkeeper"
                                src={trainingPerformance?.goalkeeper?.picture ? trainingPerformance.goalkeeper.picture : `${process.env.PUBLIC_URL}/assets/placeholder.png`}
                            /></Box>
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
                                {trainingPerformance ? trainingPerformance.goalkeeper?.name : "--"}
                            </Typography>
                        </Box>

                        <Box display="flex" flexDirection="row">
                            <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 'bold' }}
                                mr={1} ml={2} mb={1}>
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
                    </Card>
                </Grid>

                <Grid item xs={4} sm={4} md={8} order={{ xs: 2, sm: 2, md: 2 }}>
                    <Card sx={{ padding: 2, marginBottom: 1 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <RouterLink to={`/trainings/${trainingPerformance ? trainingPerformance.session?.id : ""}`}>
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
                                    Session with {trainingPerformance ? trainingPerformance.session?.category?.id : "--"}
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
                                    {trainingPerformance ? trainingPerformance.session?.date : "--"}
                                </Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Duration
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='body1'>
                                    {trainingPerformance ? trainingPerformance.session?.duration : "--"} min
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>

                    <Card sx={{ padding: 2, marginBottom: 1 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" onClick={() => { setModalIsOpen() }}>Edit</Button>
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
                                    Absent
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                {trainingPerformance?.absent ?
                                    <BsCheckCircle size="20px" color='green' /> :
                                    <TiDeleteOutline size="27px" color='red' />
                                }
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Dismissed
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                {trainingPerformance?.dismissed ?
                                    <BsCheckCircle size="20px" color='green' /> :
                                    <TiDeleteOutline size="27px" color='red' />
                                }
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Hurt
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                {trainingPerformance?.hurt ?
                                    <BsCheckCircle size="20px" color='green' /> :
                                    <TiDeleteOutline size="27px" color='red' />
                                }
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    With Seniors
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                {trainingPerformance?.with_seniors ?
                                    <BsCheckCircle size="20px" color='green' /> :
                                    <TiDeleteOutline size="27px" color='red' />
                                }
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    With national team
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                {trainingPerformance?.with_national_team ?
                                    <BsCheckCircle size="20px" color='green' /> :
                                    <TiDeleteOutline size="27px" color='red' />
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={4} sm={4} md={4} order={{ xs: 3, sm: 3, md: 3 }}>
                    <Card sx={{ width: "auto", height: "100%" }}>
                        <Box display="flex" flexDirection="row">
                            <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 'bold' }}
                                mr={1} ml={2} mb={1}>
                                Training Form:
                            </Typography>

                            {trainingPerformance?.training_form ?
                                <a target="_blank" href={trainingPerformance.training_form}>
                                    <Typography>Link</Typography>
                                </a>
                                : <Typography>No training form uploaded.</Typography>
                            }

                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            mb={2}>
                            <Button component="label" variant="contained">
                                Upload Form
                                <input
                                    hidden
                                    accept="application/pdf"
                                    multiple type="file"
                                    onChange={e => uploadTrainingForm(e)} />
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={4} sm={4} md={8} order={{ xs: 4, sm: 4, md: 4 }}>
                    <Card sx={{ padding: 2, height: "100%" }}>
                        <Typography
                            variant='subtitle1'
                            sx={{ fontWeight: 'bold' }}>
                            Further comments
                        </Typography>
                        <Typography
                            variant='body1'>
                            {trainingPerformance?.comment ? trainingPerformance.comment : "--"}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default TrainingPerformance