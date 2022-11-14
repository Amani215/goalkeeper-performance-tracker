import { Avatar, Box, Button, Card, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdAddchart, MdDeleteOutline } from 'react-icons/md'
import { useParams } from 'react-router-dom';
import { useGetMatch, useMatchCategory, useMatchError, useMatchPerformances, useMatchPerformancesReady, useMatchReady } from '../contexts/matchContext';
import { CategoryDTO } from '../DTOs';
import { MatchDTO } from '../DTOs/MatchDTO';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { ModalProp } from '../interfaces/modalProp';

function MatchDetails({ setModalIsOpen }: ModalProp) {
    const { id } = useParams();

    const [match, setMatch] = useState<MatchDTO | null>(null)
    const [matchCategory, setMatchCategory] = useState<CategoryDTO | null>(null)
    const [, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const [goalkeeperPerformances, setGoalkeeperPerformances] = useState<MatchMonitoringDTO[]>([])

    const matchContext = useGetMatch()
    const matchError = useMatchError()
    const matchReady = useMatchReady()
    const matchCategoryContext = useMatchCategory()

    const performancesContext = useMatchPerformances()
    const performancesReady = useMatchPerformancesReady()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (matchContext) {
            matchContext(id ? id : "").then(
                data => setMatch(data as MatchDTO)
            )
        }

        if (matchCategoryContext) {
            matchCategoryContext(id ? id : "").then(
                data => setMatchCategory(data as CategoryDTO)
            )
        }

        if (loaded && matchReady && matchError) {
            setError("No match Found.")
        }
        if (loaded && matchReady && !matchError) {
            setError("")
        }
    }, [matchReady, matchError, id])

    useEffect(() => {
        if (performancesContext) {
            performancesContext(id ? id : "").then((data) => {
                console.log(data)
                if (performancesReady)
                    setGoalkeeperPerformances(data != null ? data as MatchMonitoringDTO[] : goalkeeperPerformances)
            })
        }
    }, [performancesReady])

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
                    {match?.match_type}
                </Typography>
                <Typography
                    variant='h5'
                    mb={2}>
                    {matchCategory != null ?
                        matchCategory.name + " " + matchCategory.season :
                        "--"}
                </Typography>
                <Typography
                    variant='h6'
                    mb={2}>
                    {match?.date}
                </Typography>

                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 8 }} mb={3}>
                    <Grid item xs={4}>
                        <Card sx={{ padding: '10px' }}>
                            <Box
                                display="flex" justifyContent="flex-end"
                                mb={2}>
                                <Button onClick={() => { setModalIsOpen() }}>Edit Score</Button>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography variant='h6'>{match?.local}</Typography>
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{match?.score_local}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card sx={{ padding: '10px' }}>
                            <Box
                                display="flex" justifyContent="flex-end"
                                mb={2}>
                                <Button onClick={() => { setModalIsOpen() }}>Edit Score</Button>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography variant='h6'>{match?.visitor}</Typography>
                                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>{match?.score_visitor}</Typography>
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
                    {goalkeeperPerformances.length > 0 ?
                        <List
                            sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {goalkeeperPerformances.map((gp) => (
                                <div key={gp.id}>
                                    <ListItem secondaryAction={<>
                                        <IconButton edge="end" aria-label="delete" sx={{ marginRight: '1px' }}>
                                            <MdAddchart />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete">
                                            <MdDeleteOutline />
                                        </IconButton>
                                    </>}>
                                        <ListItemAvatar>
                                            <Avatar></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={gp.goalkeeper_id} />
                                    </ListItem><Divider />
                                </div>
                            ))}
                        </List>
                        : <></>
                    }
                </Paper>

            </Box>
        </>
    )
}

export default MatchDetails