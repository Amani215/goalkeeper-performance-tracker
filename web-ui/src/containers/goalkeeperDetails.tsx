import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import dayjs from 'dayjs'
import { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGoalkeeper, useGoalkeeperError, useGoalkeeperReady, useUpdatePicture } from '../contexts/goalkeeperContext'
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO'

function GoalkeeperDetails() {
    const { id } = useParams();

    const [goalkeeper, setGoalkeeper] = useState<GoalkeeperDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const goalkeeperContext = useGoalkeeper()
    const goalkeeperError = useGoalkeeperError()
    const goalkeeperReady = useGoalkeeperReady()
    const updatePicture = useUpdatePicture()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

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
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={4} sm={5} md={8} order={{ xs: 2, sm: 1, md: 1 }}>
                        <Card sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="flex-end">
                                <Button>
                                    Edit
                                </Button>
                            </Box>

                            <Box
                                display="flex"
                                flexDirection="row">
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}
                                    mr={2}>
                                    Name
                                </Typography>
                                <Typography
                                    variant='body1'>
                                    {goalkeeper?.name}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="row">
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}
                                    mr={2}>
                                    Age
                                </Typography>
                                <Typography
                                    variant='body1'>
                                    {dayjs().diff(dayjs(goalkeeper?.birthday), 'year')}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="row">
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}
                                    mr={2}>
                                    Birthday
                                </Typography>
                                <Typography
                                    variant='body1'>
                                    {dayjs(goalkeeper?.birthday).format('DD MMM YYYY').toString()}
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="row">
                                <Typography
                                    variant='subtitle1'
                                    sx={{ fontWeight: 'bold' }}
                                    mr={2}>
                                    Phone Number
                                </Typography>
                                <Typography
                                    variant='body1'>
                                    {goalkeeper?.phone}
                                </Typography>
                            </Box>

                            <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 'bold' }}
                                mr={2}>
                                Associated Categories
                            </Typography>
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
            }
        </>

    )
}

export default GoalkeeperDetails