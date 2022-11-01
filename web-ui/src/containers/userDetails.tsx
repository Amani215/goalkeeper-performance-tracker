import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useParams } from 'react-router-dom'

function UserDetails() {
    const { id } = useParams();

    return (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={4} sm={5} md={8} order={{ xs: 2, sm: 1, md: 1 }}>
                <Card >
                    <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 'bold' }}
                        ml={1} mt={1}>
                        Name
                    </Typography>
                    <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 'bold' }}
                        ml={1} mt={1}>
                        Status
                    </Typography>
                    <Typography
                        variant='subtitle1'
                        sx={{ fontWeight: 'bold' }}
                        ml={1} mt={1}>
                        Associated Categories
                    </Typography>
                </Card>
            </Grid>
            <Grid item xs={4} sm={3} md={4} order={{ xs: 1, sm: 2, md: 2 }}>
                <Card sx={{ width: "auto" }}>
                    <Box
                        component="img"
                        sx={{
                            maxHeight: { xs: "100%", sm: "100%", md: 500 },
                            maxWidth: { xs: "100%", sm: 350, md: 500 },
                        }}
                        alt="Example Coach"
                        src="https://pressboxonline.com/wp-content/uploads/2021/01/dan-enos-800x445.jpg"
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
                        <Button  >Change Picture</Button>
                    </Box>

                </Card>
            </Grid>
        </Grid>
    )
}

export default UserDetails