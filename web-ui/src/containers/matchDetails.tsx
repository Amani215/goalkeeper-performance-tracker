import { Avatar, Box, Button, Card, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Typography } from '@mui/material'
import React from 'react'
import { MdAddchart, MdDeleteOutline } from 'react-icons/md'

function MatchDetails() {
    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Typography
                    variant='h4'
                    mb={2}>
                    Tournament
                </Typography>
                <Typography
                    variant='h5'
                    mb={2}>
                    Category A
                </Typography>
                <Typography
                    variant='h6'
                    mb={2}>
                    12-11-2022
                </Typography>

                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 8 }} mb={3}>
                    <Grid item xs={4}>
                        <Card sx={{ padding: '10px' }}>
                            <Box
                                display="flex" justifyContent="flex-end"
                                mb={2}>
                                <Button >Edit Score</Button>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography variant='h6'>Local</Typography>
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>2</Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{ padding: '10px' }}>
                            <Box
                                display="flex" justifyContent="flex-end"
                                mb={2}>
                                <Button >Edit Score</Button>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography variant='h6'>Visitor</Typography>
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>1</Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                <Paper
                    elevation={2}
                    sx={{ width: '100%', bgcolor: 'background.paper', padding: '10px' }}>
                    <Box
                        display="flex" justifyContent="flex-end"
                        mb={2}>
                        <Button >Add Goalkeeper</Button>
                    </Box>

                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <ListItem secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="delete" sx={{ marginRight: '1px' }}>
                                    <MdAddchart />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete">
                                    <MdDeleteOutline />
                                </IconButton>
                            </>
                        }>
                            <ListItemAvatar>
                                <Avatar></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Goalkeeper1" />
                        </ListItem>
                        <Divider />
                        <ListItem secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="delete" sx={{ marginRight: '1px' }}>
                                    <MdAddchart />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete">
                                    <MdDeleteOutline />
                                </IconButton>
                            </>
                        }>
                            <ListItemAvatar>
                                <Avatar></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Goalkeeper2" />
                        </ListItem>
                        <Divider />
                        <ListItem secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="delete" sx={{ marginRight: '1px' }}>
                                    <MdAddchart />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete">
                                    <MdDeleteOutline />
                                </IconButton>
                            </>
                        }>
                            <ListItemAvatar>
                                <Avatar></Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Goalkeeper3" />
                        </ListItem>
                    </List>
                </Paper>

            </Box>
        </>
    )
}

export default MatchDetails