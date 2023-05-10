import { Chip, Link, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useGetGoalkeeper, useGoalkeeper, useGoalkeeperCategories, useGoalkeeperCategoriesReady, useGoalkeeperError, useGoalkeeperGrowthContext, useGoalkeeperGrowthReady, useGoalkeeperMatches, useGoalkeeperMatchesReady, useGoalkeeperReady, useGoalkeeperTrainings, useGoalkeeperTrainingsReady, useGoalkeeperUpdated, useUpdatePicture } from '../contexts/goalkeeperContext'
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO'
import { IoFootball } from "react-icons/io5"
import { CategoryDTO } from '../DTOs'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO'
import { TrainingMonitoringDTO } from '../DTOs/TrainingMonitoringDTO'
import { GrowthDTO } from '../DTOs/GrowthDTO'
import GrowthList from '../components/growthList'
import { useGrowthAdded, useGrowthDeleted, useGrowthUpdated } from '../contexts/growthContext'
import { useTranslation } from 'react-i18next'
import { ModalProp } from '../interfaces/modalProp'

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
        if (goalkeeperContext) {
            goalkeeperContext(id ? id : "").then(
                data => {
                    const dto = data as GoalkeeperDTO
                    setGoalkeeper(dto)

                    setBirthday(dto.birthday.split('/')[2] + "-" + dto.birthday.split('/')[1] + "-" + dto.birthday.split('/')[0])
                }
            )
        }
        if (loaded && goalkeeperReady && goalkeeperError) {
            setError("No goalkeeper Found.")
        }
        if (loaded && goalkeeperReady && !goalkeeperError) {
            setError("")
        }
    }, [loaded, goalkeeperReady, goalkeeperError, goalkeeperUpdated])

    useEffect(() => {
        if (categoriesContext) {
            categoriesContext(id ? id : "").then((data) => {
                if (categoriesReady)
                    setCategories(data as CategoryDTO[])
            })
        }
    }, [categoriesReady])

    useEffect(() => {
        if (matches) {
            matches(id ? id : "").then((data) => {
                if (matchesReady)
                    setMatchRows(data as MatchMonitoringDTO[])
            })
        }
    }, [matchesReady])

    useEffect(() => {
        if (trainings) {
            trainings(id ? id : "").then((data) => {
                if (trainingsReady)
                    setTrainingRows(data as TrainingMonitoringDTO[])
            })
        }
    }, [trainingsReady])

    useEffect(() => {
        if (growth) {
            growth(id ? id : "").then((data) => {
                if (growthReady)
                    setGrowthRows(data as GrowthDTO[])
            })
        }
    }, [growthReady, growthUpdated, growthDeleted, growthAdded])

    const uploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const formdata = new FormData()
            formdata.append("picture", e.target.files[0])
            if (updatePicture) {
                updatePicture(id ? id : "", formdata).then((data) => { console.log(data) })
            }
            console.log(e.target.files[0])
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
                                        src={goalkeeper ? goalkeeper?.picture : `${process.env.PUBLIC_URL}/assets/placeholder.png`}
                                    />
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    mb={1}>
                                    <Typography
                                        variant='subtitle2'
                                        sx={{ fontStyle: 'italic' }}
                                        ml={1} mt={1}>
                                        UID: {id}
                                    </Typography>
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
                    <GrowthList goalkeeperID={id ? id : ""} growthList={growthRows} />

                    {/* MATCHES */}
                    <Typography fontWeight="bold" mt={2} mb={1}>{t("match_performances")}</Typography>
                    {matchRows.length > 0 ?
                        < DataGrid
                            rows={matchRows || []}
                            columns={matchColumns}
                            pageSize={3}
                            rowsPerPageOptions={[3]}
                        /> : <></>
                    }

                    {/* ATTENDANCE */}
                    <Typography fontWeight="bold" mt={2} mb={1}>{t("training_attendance")}</Typography>
                    {trainingRows.length > 0 ?
                        < DataGrid
                            rows={trainingRows || []}
                            columns={trainingColumns}
                            pageSize={3}
                            rowsPerPageOptions={[3]}
                        /> : <></>
                    }

                    <Box sx={{ height: "5%" }}></Box>
                </>
            }
        </>

    )
}

export default GoalkeeperDetails