import { Box, Button, Card, Chip, Divider, Grid, IconButton, Link, Switch, Typography } from '@mui/material'
import React from 'react'
import { MdLaunch } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { TiDeleteOutline } from 'react-icons/ti'
import { BsCheckCircle } from 'react-icons/bs'

function TrainingPerformance() {
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
                                Goalkeeper1
                            </Typography>
                        </Box>

                        <Box display="flex" flexDirection="row">
                            <Typography
                                variant='subtitle1'
                                sx={{ fontWeight: 'bold' }}
                                mr={1} ml={2} mb={1}>
                                Associated Categories
                            </Typography>
                            {/* {categories.length > 0 ?
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
                                </Box>} */}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={4} sm={4} md={8} order={{ xs: 2, sm: 2, md: 2 }}>
                    <Card sx={{ padding: 2, marginBottom: 1 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <RouterLink to={`/trainings/jhfd`}>
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
                                    Session with Seniors2022
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
                                    12/12/2022
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
                                    90 min
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>

                    <Card sx={{ padding: 2, marginBottom: 1 }}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained">Edit</Button>
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
                                <TiDeleteOutline size="27px" color='red' />
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Dismissed
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <BsCheckCircle size="20px" color='green' />
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Hurt
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TiDeleteOutline size="27px" color='red' />
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    With Seniors
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TiDeleteOutline size="27px" color='red' />
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    With national team
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TiDeleteOutline size="27px" color='red' />
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
                            <Typography mt="2px">Link</Typography>
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
                                    onChange={e => console.log("upload form")} />
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
                            comments...
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default TrainingPerformance