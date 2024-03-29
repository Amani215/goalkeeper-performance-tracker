import { Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { MdDeleteOutline } from 'react-icons/md'
import { TbFileChart } from 'react-icons/tb'
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDeleteMatchGoalkeeper, useGetMatch, useMatchError, useMatchGoalkeepersUpdated, useMatchPerformances, useMatchPerformancesReady, useMatchReady, useMatchUpdated } from '../contexts/matchContext';
import { MatchDTO } from '../DTOs/MatchDTO';
import { MatchMonitoringDTO } from '../DTOs/MatchMonitoringDTO';
import { MultiModalProp } from '../interfaces/modalProp';
import { useTranslation } from 'react-i18next'

function MatchDetails({ modal1, modal2 }: Readonly<MultiModalProp>) {
    const { id } = useParams();
    const { t } = useTranslation();

    const [match, setMatch] = useState<MatchDTO | null>(null)
    const [error, setError] = useState("")
    const [loaded, setLoaded] = useState(false)

    const [goalkeeperPerformances, setGoalkeeperPerformances] = useState<MatchMonitoringDTO[]>([])

    const matchContext = useGetMatch()
    const matchError = useMatchError()
    const matchReady = useMatchReady()
    const matchUpdated = useMatchUpdated()
    const deleteMatchGoalkeeper = useDeleteMatchGoalkeeper()

    const performancesContext = useMatchPerformances()
    const performancesReady = useMatchPerformancesReady()
    const performancesUpdated = useMatchGoalkeepersUpdated()

    useEffect(
        () => {
            setLoaded(true)
        }, []
    )

    useEffect(() => {
        if (matchContext) {
            matchContext(id ?? "").then(
                data => setMatch(data as MatchDTO)
            )
        }

        if (loaded && matchReady && matchError) {
            setError("No match Found.")
        }
        if (loaded && matchReady && !matchError) {
            setError("")
        }
    }, [matchReady, matchError, matchUpdated, id])

    useEffect(() => {
        if (performancesContext) {
            performancesContext(id ?? "").then((data) => {
                if (performancesReady)
                    setGoalkeeperPerformances(data != null ? data : goalkeeperPerformances)
            })
        }
    }, [performancesReady, performancesUpdated])

    const [deleteGoalkeeperDialogIsOpen, setDeleteGoalkeeperDialogIsOpen] = useState<boolean>(false)
    const [goalkeeperToDelete, setGoalkeeperToDelete] = useState<MatchMonitoringDTO | null>(null)

    const handleCloseDeleteGoalkeeperDialog = () => {
        setDeleteGoalkeeperDialogIsOpen(false)
        setGoalkeeperToDelete(null)
    }

    const handleOpenDeleteGoalkeeperDialog = (goalkeeper: MatchMonitoringDTO) => {
        setDeleteGoalkeeperDialogIsOpen(true)
        setGoalkeeperToDelete(goalkeeper)
    }

    const deleteGoalkeeperPerformance = () => {
        if (deleteMatchGoalkeeper) {
            deleteMatchGoalkeeper(goalkeeperToDelete ? goalkeeperToDelete.id : '', id ?? "")
            setDeleteGoalkeeperDialogIsOpen(false)
        }
    }

    return (
        <>{error != "" ?
            <Typography
                variant='subtitle2'
                ml={1} mt={1}>
                {error}
            </Typography>
            :
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Typography
                    variant='h4'
                    mb={2}>
                    {match?.match_type} ({t(`${match?.result}`)})
                </Typography>
                <Typography
                    variant='h5'
                    mb={2}>
                    {match ? `${match.category?.name} ${match.category?.season}` : "--"}
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
                                <Button onClick={() => { modal1.setModalIsOpen() }}>{t("edit")} Score</Button>
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
                                <Button onClick={() => { modal1.setModalIsOpen() }}>{t("edit")} Score</Button>
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
                        <Button onClick={() => { modal2.setModalIsOpen() }}>{t("add_goalkeeper")}</Button>
                    </Box>
                    {goalkeeperPerformances.length > 0 ?
                        <List
                            sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {goalkeeperPerformances.map((gp) => (
                                <div key={gp.id}>
                                    <ListItem secondaryAction={<>
                                        <RouterLink to={`/match-performance/${gp.id}`}>
                                            <IconButton edge="end" aria-label="delete" sx={{ marginRight: '1px' }}>
                                                <TbFileChart />
                                            </IconButton>
                                        </RouterLink>
                                        <IconButton edge="end" aria-label="delete" onClick={() => { handleOpenDeleteGoalkeeperDialog(gp) }}>
                                            <MdDeleteOutline />
                                        </IconButton>
                                    </>}>
                                        <ListItemAvatar>
                                            <RouterLink to={`/goalkeepers/${gp.goalkeeper.id}`}>
                                                <Avatar src={gp.goalkeeper.picture}></Avatar>
                                            </RouterLink>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${gp.goalkeeper.name} (${gp.goalkeeper_order})`} />
                                    </ListItem><Divider />
                                </div>
                            ))}
                        </List>
                        : <></>
                    }
                </Paper>

                <Dialog
                    open={deleteGoalkeeperDialogIsOpen}
                    onClose={handleCloseDeleteGoalkeeperDialog}
                >
                    <DialogTitle id="alert-dialog-title">{t("are_you_sure")}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {t("deleting_goalkeeper_match_warning")}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteGoalkeeperDialog}>{t("cancel")}</Button>
                        <Button onClick={() => deleteGoalkeeperPerformance()} autoFocus>{t("yes")}</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        }
        </>
    )
}

export default MatchDetails