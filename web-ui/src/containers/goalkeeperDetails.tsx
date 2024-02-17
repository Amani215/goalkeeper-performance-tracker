import { ChangeEvent, useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { Chip, Link, Typography, Box, Button, Card, Grid } from '@mui/material'
import { GridColDef, DataGrid } from '@mui/x-data-grid'
import { IoFootball } from "react-icons/io5"
import dayjs from 'dayjs'
import { ModalProp } from '../interfaces/modalProp'
import GrowthList from '../components/growthList'
import { useGetGoalkeeper, useGoalkeeperCategories, useGoalkeeperCategoriesReady, useGoalkeeperError, useGoalkeeperGrowthContext, useGoalkeeperGrowthReady, useGoalkeeperMatches, useGoalkeeperMatchesReady, useGoalkeeperReady, useGoalkeeperTrainings, useGoalkeeperTrainingsReady, useGoalkeeperUpdated, useUpdatePicture } from '../contexts/goalkeeperContext'
import { useGrowthAdded, useGrowthDeleted, useGrowthUpdated } from '../contexts/growthContext'
import { CategoryDTO, GoalkeeperDTO, MatchMonitoringDTO, TrainingMonitoringDTO, GrowthDTO } from '../DTOs'
import { useTranslation } from 'react-i18next'

function GoalkeeperDetails({ setModalIsOpen }: ModalProp) {
    const { id } = useParams();
    const { t } = useTranslation()

    const matchColumns: GridColDef[] = [
        {
            field: 'match',
            headerName: 'Match',
            flex: 1,
            minWidth: 60,
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/matches/${params.row.match.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>
                            {params.row.match.match_type} {params.row.match.local}-{params.row.match.visitor}</Typography>
                    </Link>
                );
            }
        },
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.match.date}</Typography>
                );
            }
        },
        {
            field: 'category',
            headerName: `${t("category")}`,
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.match.category.id}</Typography>
                );
            }
        },
        {
            field: 'id',
            headerName: `${t("performance_sheet")}`,
            flex: 1,
            minWidth: 10,
            align: "center",
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/match-performance/${params.row.id}`}
                        color="inherit">
                        <Typography>{t("link")}</Typography>
                    </Link>
                );
            }
        }
    ]

    const trainingColumns: GridColDef[] = [
        {
            field: 'training',
            headerName: `${t("training")}`,
            flex: 1,
            minWidth: 60,
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/trainings/${params.row.session.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>
                            {params.row.session.category.id} Training</Typography>
                    </Link>
                );
            }
        },
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.session.date}</Typography>
                );
            }
        },
        {
            field: 'attendance',
            headerName: `${t("attendance")}`,
            flex: 1,
            minWidth: 10,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.attendance}</Typography>
                );
            }
        }
    ]

    const [goalkeeper, setGoalkeeper] = useState<GoalkeeperDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const goalkeeperContext = useGetGoalkeeper()
    const goalkeeperError = useGoalkeeperError()
    const goalkeeperReady = useGoalkeeperReady()
    const goalkeeperUpdated = useGoalkeeperUpdated()
    const updatePicture = useUpdatePicture()

    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const categoriesContext = useGoalkeeperCategories()
    const categoriesReady = useGoalkeeperCategoriesReady()

    const [matchRows, setMatchRows] = useState<MatchMonitoringDTO[]>([] as MatchMonitoringDTO[])
    const matches = useGoalkeeperMatches()
    const matchesReady = useGoalkeeperMatchesReady()

    const [trainingRows, setTrainingRows] = useState<TrainingMonitoringDTO[]>([] as TrainingMonitoringDTO[])
    const trainings = useGoalkeeperTrainings()
    const trainingsReady = useGoalkeeperTrainingsReady()

    const [growthRows, setGrowthRows] = useState<GrowthDTO[]>([] as GrowthDTO[])
    const growth = useGoalkeeperGrowthContext()
    const growthReady = useGoalkeeperGrowthReady()
    const growthAdded = useGrowthAdded()
    const growthUpdated = useGrowthUpdated()
    const growthDeleted = useGrowthDeleted()

    const [birthday, setBirthday] = useState<string>("")

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        const fetchGoalkeeper = async () => {
            try {
                if (goalkeeperContext) {
                    const data = await goalkeeperContext(id ?? "")
                    const dto = data as GoalkeeperDTO
                    setGoalkeeper(dto)
                    setBirthday(dto.birthday.split('/')[2] + "-" + dto.birthday.split('/')[1] + "-" + dto.birthday.split('/')[0])
                }
            } catch (error) {
                console.error("Error fetching goalkeeper data: ", error)
            }
        }

        fetchGoalkeeper()

        if (loaded && goalkeeperReady && goalkeeperError) {
            setError("No goalkeeper Found.")
        }
        if (loaded && goalkeeperReady && !goalkeeperError) {
            setError("")
        }
    }, [goalkeeperReady, goalkeeperError, goalkeeperUpdated])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (categoriesContext) {
                    const data = await categoriesContext(id ?? "")
                    if (categoriesReady)
                        setCategories(data as CategoryDTO[])
                }
            } catch (error) {
                console.error("Error fetching goalkeeper categories data: ", error)
            }
        }

        fetchCategories()
    }, [categoriesReady])

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                if (matches) {
                    const data = await matches(id ?? "")
                    if (matchesReady)
                        setMatchRows(data as MatchMonitoringDTO[])
                }
            } catch (error) {
                console.error("Error fetching goalkeeper matches data: ", error)
            }
        }

        fetchMatches()
    }, [matchesReady])

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                if (trainings) {
                    const data = await trainings(id ?? "")
                    if (trainingsReady)
                        setTrainingRows(data as TrainingMonitoringDTO[])
                }
            } catch (error) {
                console.error("Error fetching goalkeeper trainings data: ", error)
            }
        }

        fetchTrainings()
    }, [trainingsReady])

    useEffect(() => {
        const fetchGrowth = async () => {
            try {
                if (growth) {
                    const data = await growth(id ?? "")
                    if (growthReady)
                        setGrowthRows(data as GrowthDTO[])
                }
            } catch (error) {
                console.error("Error fetching goalkeeper growth data: ", error)
            }
        }

        fetchGrowth()
    }, [growthReady, growthUpdated, growthDeleted, growthAdded])

    const uploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const formdata = new FormData()
            formdata.append("picture", e.target.files[0])
            if (updatePicture) {
                updatePicture(id ?? "", formdata).then((data) => { console.log(data) })
            }
        }
    }

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
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <Grid item xs={4} sm={5} md={8} order={{ xs: 2, sm: 1, md: 1 }}>
                            <Card sx={{ padding: 2, height: "100%" }}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        onClick={() => setModalIsOpen()}>
                                        {t("edit")}
                                    </Button>
                                </Box>

                                <Grid container columns={8}>
                                    <Grid item xs={3}>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold' }}>
                                            {t("name")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            variant='body1'>
                                            {goalkeeper?.name}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold' }}>
                                            Age
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            variant='body1'>
                                            {dayjs().diff(dayjs(birthday), 'year')}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold' }}
                                            mr={2}>
                                            {t("birthdate")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            variant='body1'>
                                            {dayjs(birthday).format("DD MMM YYYY").toString()}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold' }}
                                            mr={2}>
                                            {t("phone")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            variant='body1'>
                                            {goalkeeper?.phone}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={8} mb={1}>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold' }}>
                                            {t("associated_categories")}
                                        </Typography>
                                    </Grid>

                                    <Grid
                                        container
                                        spacing={{ xs: 1 }}
                                        columns={{ xs: 8, sm: 8, md: 12 }} mt={1}>
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
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>

                        <Grid item xs={4} sm={3} md={4} order={{ xs: 1, sm: 2, md: 2 }}>
                            <Card sx={{ width: "auto" }}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center">
                                    <Box
                                        component="img"
                                        sx={{
                                            height: "16rem",
                                            width: "16rem",
                                        }}
                                        src={goalkeeper && goalkeeper.picture != "" ? goalkeeper.picture : `${process.env.PUBLIC_URL}/assets/placeholder.png`}
                                    />
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    mb={1}
                                    mt={2}>
                                    <Button component="label">
                                        {t("change_pic")}
                                        <input
                                            hidden
                                            accept="image/*"
                                            multiple type="file"
                                            onChange={e => uploadPicture(e)} />
                                    </Button>

                                </Box>

                            </Card>
                        </Grid>
                    </Grid>

                    {/* GROWTH */}
                    <GrowthList goalkeeperID={id ?? ""} growthList={growthRows} />

                    {/* MATCHES */}
                    <Typography fontWeight="bold" mt={2} mb={1}>{t("match_performances")}</Typography>
                    {matchRows.length > 0 ?
                        < DataGrid
                            rows={matchRows || []}
                            columns={matchColumns}
                            pageSizeOptions={[5, 10, 50]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 5 } },
                            }}
                        /> : <></>
                    }

                    {/* ATTENDANCE */}
                    <Typography fontWeight="bold" mt={2} mb={1}>{t("training_attendance")}</Typography>
                    {trainingRows.length > 0 ?
                        < DataGrid
                            rows={trainingRows || []}
                            columns={trainingColumns}
                            pageSizeOptions={[5, 10, 50]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 5 } },
                            }}
                        /> : <></>
                    }

                    <Box sx={{ height: "5%" }}></Box>
                </>
            }
        </>

    )
}

export default GoalkeeperDetails