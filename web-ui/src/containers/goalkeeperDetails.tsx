import { Chip, Divider, IconButton, Link, List, ListItem, ListItemText, Paper, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useGoalkeeper, useGoalkeeperCategories, useGoalkeeperCategoriesReady, useGoalkeeperError, useGoalkeeperMatches, useGoalkeeperMatchesReady, useGoalkeeperReady, useUpdatePicture } from '../contexts/goalkeeperContext'
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO'
import { IoFootball } from "react-icons/io5"
import { CategoryDTO } from '../DTOs'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { GridColDef } from '@mui/x-data-grid'
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO'


const columns: GridColDef[] = [
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
        headerName: 'Category',
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
        headerName: 'Performance Sheet',
        flex: 1,
        minWidth: 10,
        align: "center",
        renderCell: (params) => {
            return (
                <Link
                    component={RouterLink}
                    to={`/match-performance/${params.row.id}`}
                    color="inherit">
                    <Typography>Link</Typography>
                </Link>
            );
        }
    }
]

function GoalkeeperDetails() {
    const { id } = useParams();

    const [goalkeeper, setGoalkeeper] = useState<GoalkeeperDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const goalkeeperContext = useGoalkeeper()
    const goalkeeperError = useGoalkeeperError()
    const goalkeeperReady = useGoalkeeperReady()
    const updatePicture = useUpdatePicture()

    const [categories, setCategories] = useState<CategoryDTO[]>([])
    const categoriesContext = useGoalkeeperCategories()
    const categoriesReady = useGoalkeeperCategoriesReady()

    const [rows, setRows] = useState<MatchMonitoringDTO[]>([] as MatchMonitoringDTO[])
    const matches = useGoalkeeperMatches()
    const matchesReady = useGoalkeeperMatchesReady()

    useEffect(() => { setLoaded(true) }, [])

    useEffect(() => {
        if (goalkeeperContext) {
            goalkeeperContext(id ? id : "").then(
                data => setGoalkeeper(data as GoalkeeperDTO)
            )
        }
        if (loaded && goalkeeperReady && goalkeeperError) {
            setError("No goalkeeper Found.")
        }
        if (loaded && goalkeeperReady && !goalkeeperError) {
            setError("")
        }
    }, [loaded, goalkeeperReady, goalkeeperError])

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
                    setRows(data as MatchMonitoringDTO[])
            })
        }
    }, [matchesReady])

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
                                    <Button>
                                        Edit
                                    </Button>
                                </Box>

                                <Grid container columns={8}>
                                    <Grid item xs={3}>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold' }}>
                                            Name
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
                                            {dayjs().diff(dayjs(goalkeeper?.birthday), 'year')}
                                        </Typography>
                                    </Grid>

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
                                            {dayjs(goalkeeper?.birthday).format('DD MMM YYYY').toString()}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography
                                            variant='subtitle1'
                                            sx={{ fontWeight: 'bold' }}
                                            mr={2}>
                                            Phone Number
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
                                            Associated Categories
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
                                                No associated categories yet.
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
                                    alignItems="center"
                                    component="img"
                                    sx={{
                                        maxHeight: { xs: "100%", sm: "100%", md: 500 },
                                        maxWidth: { xs: "100%", sm: 350, md: 500 },
                                    }}
                                    alt="Example Goalkeeper"
                                    src={goalkeeper?.picture ? goalkeeper.picture : "https://pressboxonline.com/wp-content/uploads/2021/01/dan-enos-800x445.jpg"}
                                />
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
                                        Change Picture
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

                    <Typography fontWeight="bold" mt={2} mb={1}>Match performances</Typography>
                    {rows.length > 0 ?
                        < DataGrid
                            rows={rows || []}
                            columns={columns}
                            pageSize={3}
                            rowsPerPageOptions={[3]}
                        /> : <></>
                    }
                </>
            }
        </>

    )
}

export default GoalkeeperDetails