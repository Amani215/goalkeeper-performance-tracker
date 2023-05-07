import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MatchDTO } from "../../DTOs/MatchDTO";
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { Navigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import { useDeleteMatch, useDeleteMatchError } from '../../contexts/matchesContext';
import UpdateMatch from '../../containers/modals/updateMatch';
import { useTranslation } from 'react-i18next';

type PropType = {
    matches: MatchDTO[]
}

function MatchesList({ matches }: PropType) {
    const { t } = useTranslation();
    const location = useLocation()

    // Columns
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 2,
            minWidth: 80
        },
        {
            field: 'category',
            headerName: `${t("category")}`,
            flex: 2,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <Typography>{params.row.category.id}</Typography>
                );
            }
        },
        {
            field: 'local',
            headerName: `${t("local")}`,
            flex: 2,
            minWidth: 80
        },
        {
            field: 'visitor',
            headerName: `${t("visitor")}`,
            flex: 2,
            minWidth: 80
        },
        {
            field: 'match_type',
            headerName: `${t("match_type")}`,
            flex: 2,
            minWidth: 80
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

    // Click event
    const [redirect, setRedirect] = useState<boolean>(false)
    const [redirectID, setRedirectID] = useState<string>("")
    const redirectTo = (id: string) => {
        setRedirect(true)
        setRedirectID(id)
    }

    if (redirect) {
        return <Navigate to={`/matches/${redirectID}`} state={{ from: location }} />
    }

    return (
        <>
            {matches.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ height: 700, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={matches || []}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            onRowClick={(params) => {
                                redirectTo(params.row.id)
                            }}
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
                                variant='subtitle2'>{t("no_matches")}
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
                    {t("are_you_sure")}
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
                    <Button onClick={handleCloseDeleteDialog}>{t("cancel")}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t("yes")}
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