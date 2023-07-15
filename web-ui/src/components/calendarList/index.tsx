import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDTO } from '../../DTOs/CalendarDTO';
import { useDeleteCalendar, useDeleteCalendarError } from '../../contexts/calendarContext';
import NewCalendar from '../../containers/modals/newCalendar';

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
                        <IconButton title='Delete' onClick={() => handleOpenDeleteDialog(params.row.id)}>
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

    return (
        <>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                mt={3}
                mb={1}>
                <Typography fontWeight="bold" mt={2} mb={1}>{t("calendars")}</Typography>

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
                            // sx={{ marginBottom: 2 }}
                            >
                                <Typography>{calendar.calendar_type}</Typography>
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
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
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

            <NewCalendar
                categoryID={categoryID} modalProp={{
                    modalIsOpen: addModalIsOpen,
                    setModalIsOpen: handleCloseAddModal
                }} />
        </>
    )
}

export default CalendarList