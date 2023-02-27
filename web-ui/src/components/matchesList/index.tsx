import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MatchDTO } from "../../DTOs/MatchDTO";
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import { useDeleteMatch, useDeleteMatchError } from '../../contexts/matchesContext';
import UpdateMatch from '../../containers/modals/updateMatch';

type PropType = {
    matches: MatchDTO[]
}

function MatchesList({ matches }: PropType) {
    // Columns
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/matches/${params.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>{params.row.date}</Typography>
                    </Link>
                );
            }
        },
        {
            field: 'local',
            headerName: 'Local',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/matches/${params.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>{params.row.local}</Typography>
                    </Link>
                );
            }
        },
        {
            field: 'visitor',
            headerName: 'Visitor',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/matches/${params.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>{params.row.visitor}</Typography>
                    </Link>
                );
            }
        },
        {
            field: 'match_type',
            headerName: 'Match Type',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/matches/${params.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>{params.row.match_type}</Typography>
                    </Link>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 30,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton title='Edit match' onClick={() => handleOpenUpdateModal(params.row)}>
                            <MdEdit />
                        </IconButton>
                        <IconButton title='Delete match' onClick={() => handleOpenDeleteDialog(params.row.id)}>
                            <MdDelete />
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    // Delete Dialog
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false)
    const [matchToDelete, setMatchToDelete] = useState<string>("")

    const deleteMatch = useDeleteMatch()
    const deleteMatchError = useDeleteMatchError()

    const handleOpenDeleteDialog = (matchID: string) => {
        setMatchToDelete(matchID)
        setDeleteDialogIsOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setMatchToDelete("")
        setDeleteDialogIsOpen(false);
    };

    const handleDelete = async () => {
        if (deleteMatch) {
            await deleteMatch(matchToDelete)
        }
    }

    // Update Modal
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false)
    const [matchToUpdate, setMatchToUpdate] = useState<MatchDTO | null>(null)

    const handleOpenUpdateModal = (match: MatchDTO) => {
        setMatchToUpdate(match)
        setUpdateModalIsOpen(true)
    }
    const handleCloseUpdateModal = () => {
        setMatchToUpdate(null)
        setUpdateModalIsOpen(false)
    }

    return (
        <>
            {matches.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ height: 400, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={matches || []}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />
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
                                variant='subtitle2'>No matches in this section.
                            </Typography>
                        </div>
                    </Card>
                </Box>
            }

            <Dialog
                open={deleteDialogIsOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure?"}
                </DialogTitle>
                <DialogContent>
                    {deleteMatchError != "" ?
                        <Alert severity='error' sx={{ marginBottom: 1 }}>{deleteMatchError}</Alert>
                        : <></>}
                    <DialogContentText id="alert-dialog-description">
                        By clicking yes you are going to delete this match permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <UpdateMatch match={matchToUpdate} modalProp={{
                modalIsOpen: updateModalIsOpen,
                setModalIsOpen: handleCloseUpdateModal
            }} />
        </>


    )
}

export default MatchesList