import { Box, Button, Card, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { MdLaunch } from 'react-icons/md'

function MatchPerformance() {
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
                            <IconButton>
                                <MdLaunch />
                            </IconButton>
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
                            <IconButton>
                                <MdLaunch />
                            </IconButton>
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
                                    01/01/2022
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
                                variant='subtitle1'
                                sx={{ fontWeight: 'bold' }}
                                ml={1} mt={1}>
                                Goalkeeper
                            </Typography>
                        </Box>

                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 4, md: 12 }}>
                <Grid item xs={4} sm={4} md={8} order={{ xs: 1, sm: 1, md: 1 }}>
                    <Card sx={{ marginTop: 2 }}>
                        <Box
                            display="flex" flexDirection="row" justifyContent="center"
                            alignItems="center">

                            <Typography
                                variant='h6'
                                sx={{ fontWeight: 'bold' }}
                                mr={2}>
                                Grade
                            </Typography>
                            <Typography variant='h6'>
                                14.25
                            </Typography>


                        </Box>
                    </Card>
                    <Card sx={{ width: "100%", marginTop: 2, padding: 2 }}>
                        <Box
                            display="flex" justifyContent="flex-end">
                            <Button>Update Feedback</Button>
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
                                    Time Played
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='subtitle1'>
                                    70 min
                                </Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Assets
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='subtitle1'>
                                    Asset Chips
                                </Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Weaknesses
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='subtitle1'>
                                    Weaknesses Chips
                                </Typography>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography
                                    variant='subtitle1'>
                                    Comment
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography
                                    variant='subtitle1'>
                                    Was replaced by goalkeeper2
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Grid item xs={4} sm={4} md={4} order={{ xs: 2, sm: 2, md: 2 }}>
                    <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 12, sm: 4 }}>
                        <Grid item xs={6} sm={2}>
                            <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    p={2}
                                >
                                    <Typography variant='h3'>4</Typography>
                                    <Typography
                                        variant='h6'
                                        align='center'
                                        sx={{ fontStyle: 'Bold' }}
                                        mt={1}>
                                        Goals Conceded
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>

                        <Grid item xs={6} sm={2}>
                            <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    p={2}
                                >
                                    <Typography variant='h3'>2</Typography>
                                    <Typography
                                        variant='h6'
                                        align='center'
                                        sx={{ fontStyle: 'Bold' }}
                                        mt={1}>
                                        Goals Scored
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>

                        <Grid item xs={6} sm={2}>
                            <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    p={2}
                                >
                                    <Typography variant='h3'>3</Typography>
                                    <Typography
                                        variant='h6'
                                        align='center'
                                        sx={{ fontStyle: 'Bold' }}
                                        mt={1}>
                                        Penalties Saved
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>

                        <Grid item xs={6} sm={2}>
                            <Card sx={{ width: "auto", height: "100%", marginTop: 2 }}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    p={2}
                                >
                                    <Typography variant='h3'>0</Typography>
                                    <Typography
                                        variant='h6'
                                        align='center'
                                        sx={{ fontStyle: 'Bold' }}
                                        mt={1}>
                                        Penalties Non Saved
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </>
    )
}

export default MatchPerformance