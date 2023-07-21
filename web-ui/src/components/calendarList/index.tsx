import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { MdAdd, MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDTO } from '../../DTOs/CalendarDTO';
import { useDeleteCalendar, useDeleteCalendarError, useDeleteCalendarItem, useDeleteCalendarItemError } from '../../contexts/calendarContext';
import NewCalendar from '../../containers/modals/newCalendar';
import NewCalendarItem from '../../containers/modals/newCalendarItem';

type PropType = {
    categoryID: string,
    archived: boolean,
    calendarList: CalendarDTO[]
}

function CalendarList({ categoryID, archived, calendarList }: PropType) {
    const { t } = useTranslation();

    // Columns
    const columns: GridColDef[] = [
        {
            field: 'journey',
            headerName: `${t("journey")}`,
            headerAlign: 'left',
            flex: 2,
            minWidth: 60,
            align: "left",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.journey}</Typography>
                );
            }
        },
        {
            field: 'local',
            headerName: `${t("local")}`,
            headerAlign: 'left',
            flex: 3,
            minWidth: 60,
            align: "left",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.local}</Typography>
                );
            }
        },
        {
            field: 'visitor',
            headerName: `${t("visitor")}`,
            headerAlign: 'left',
            flex: 3,
            minWidth: 60,
            align: "left",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.visitor}</Typography>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 80,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton title='Delete' onClick={() => handleOpenDeleteJourneyDialog(params.row.id)}>
                            <MdDelete />
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    // Delete Dialog
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false)
    const [calendarToDelete, setCalendarToDelete] = useState<string>("")

    const deleteCalendar = useDeleteCalendar()
    const deleteCalendarError = useDeleteCalendarError()

    const handleOpenDeleteDialog = (calendarID: string) => {
        setCalendarToDelete(calendarID)
        setDeleteDialogIsOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setCalendarToDelete("")
        setDeleteDialogIsOpen(false);
    };

    const handleDelete = async () => {
        if (deleteCalendar) {
            await deleteCalendar(calendarToDelete).then(() => setDeleteDialogIsOpen(false))
        }
    }

    // Add Modal
    const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false)

    const handleOpenAddModal = () => setAddModalIsOpen(true)
    const handleCloseAddModal = () => setAddModalIsOpen(false)

    // Add Journey Modal
    const [addJourneyModalIsOpen, setAddJourneyModalIsOpen] = useState<boolean>(false)
    const [calendarID, setCalendarID] = useState<string>("")

    const handleOpenAddJourneyModal = (_calendarID: string) => {
        setCalendarID(_calendarID)
        setAddJourneyModalIsOpen(true)
    }
    const handleCloseAddJourneyModal = () => {
        setCalendarID("")
        setAddJourneyModalIsOpen(false)
    }

    // Delete Journey Dialog
    const [deleteJourneyDialogIsOpen, setDeleteJourneyDialogIsOpen] = useState<boolean>(false)
    const [journeyToDelete, setJourneyToDelete] = useState<string>("")

    const deleteJourney = useDeleteCalendarItem()
    const deleteJourneyError = useDeleteCalendarItemError()

    const handleOpenDeleteJourneyDialog = (calendarID: string) => {
        setJourneyToDelete(calendarID)
        setDeleteJourneyDialogIsOpen(true);
    };

    const handleCloseDeleteJourneyDialog = () => {
        setJourneyToDelete("")
        setDeleteJourneyDialogIsOpen(false);
    };

    const handleDeleteJourney = async () => {
        if (deleteJourney) {
            await deleteJourney(journeyToDelete).then(() => setDeleteJourneyDialogIsOpen(false))
        }
    }

    return (
        <>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                mt={1} mb={3}>
                <Typography variant='h6' fontWeight="bold">{t("calendars")}</Typography>

                <Button
                    disabled={archived}
                    variant="contained"
                    onClick={() => { handleOpenAddModal() }}
                >{t("add")}
                </Button>
            </Box>

            {calendarList.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '100%', flexGrow: 1 }}>
                        {calendarList.map((calendar) => (
                            <Box
                                key={calendar.calendar_type}
                                sx={{ height: 375, marginBottom: 6 }}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="space-between">
                                    <Typography fontWeight="bold">{calendar.calendar_type}</Typography>

                                    <Button
                                        startIcon={<MdAdd />}
                                        disabled={archived}
                                        variant="text"
                                        onClick={() => { handleOpenAddJourneyModal(calendar.id) }}
                                    >{t("add")} {t("journey")}
                                    </Button>
                                </Box>

                                <DataGrid
                                    rows={calendar.items || []}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                />
                            </Box>
                        ))}
                    </div>
                </div> :
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={1}
                >
                    <Card
                        sx={{
                            height: { xs: 100 },
                            width: { xs: "100%" },
                        }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '15vh',
                            color: '#616161'
                        }}>
                            <Typography
                                variant='subtitle2'>{t("no_data")}
                            </Typography>
                        </div>
                    </Card>
                </Box>
            }

            {/* DELETE */}
            <Dialog
                open={deleteDialogIsOpen}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle id="alert-dialog-title">
                    {t("are_you_sure")}
                </DialogTitle>
                <DialogContent>
                    {deleteCalendarError != "" ?
                        <Alert severity='error' sx={{ marginBottom: 1 }}>{deleteCalendarError}</Alert>
                        : <></>}
                    <DialogContentText id="alert-dialog-description">
                        {t("deleting_planning_warning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>{t("cancel")}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t("yes")}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* DELETE JOURNEY*/}
            <Dialog
                open={deleteJourneyDialogIsOpen}
                onClose={handleCloseDeleteJourneyDialog}
            >
                <DialogTitle id="alert-dialog-title">
                    {t("are_you_sure")}
                </DialogTitle>
                <DialogContent>
                    {deleteJourneyError != "" ?
                        <Alert severity='error' sx={{ marginBottom: 1 }}>{deleteJourneyError}</Alert>
                        : <></>}
                    <DialogContentText id="alert-dialog-description">
                        {t("deleting_journey_warning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteJourneyDialog}>{t("cancel")}</Button>
                    <Button onClick={handleDeleteJourney} autoFocus>
                        {t("yes")}
                    </Button>
                </DialogActions>
            </Dialog>


            <NewCalendar
                categoryID={categoryID} modalProp={{
                    modalIsOpen: addModalIsOpen,
                    setModalIsOpen: handleCloseAddModal
                }} />

            <NewCalendarItem
                calendarID={calendarID} modalProp={{
                    modalIsOpen: addJourneyModalIsOpen,
                    setModalIsOpen: handleCloseAddJourneyModal
                }} />
        </>
    )
}

export default CalendarList