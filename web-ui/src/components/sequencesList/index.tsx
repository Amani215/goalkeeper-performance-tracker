import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import { useDeleteMatch, useDeleteMatchError } from '../../contexts/matchesContext';
import { MatchSequenceDTO } from '../../DTOs/MatchSequenceDTO';

type PropType = {
    sequences: MatchSequenceDTO[]
}

function SequencesList({ sequences }: PropType) {
    // Columns
    const columns: GridColDef[] = [
        {
            field: 'sequence_number',
            headerName: 'Num',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Typography>{params.row.sequence_number}</Typography>
                );
            }
        },
        {
            field: 'action_type',
            headerName: 'Action',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Typography>{params.row.action_type}</Typography>
                );
            }
        },
        {
            field: 'reaction_type',
            headerName: 'Reaction',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Typography>{params.row.reaction_type}</Typography>
                );
            }
        },
        {
            field: 'action_result',
            headerName: 'Result',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Typography>{params.row.action_result}</Typography>
                );
            }
        },
        {
            field: 'comment',
            headerName: 'Comment',
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Typography>{params.row.comment}</Typography>
                );
            }
        },
    ];

    // Delete Dialog
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false)
    const [sequenceToDelete, setSequenceToDelete] = useState<string>("")

    const deleteMatch = useDeleteMatch()
    const deleteMatchError = useDeleteMatchError()

    const handleOpenDeleteDialog = (sequenceID: string) => {
        setSequenceToDelete(sequenceID)
        setDeleteDialogIsOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setSequenceToDelete("")
        setDeleteDialogIsOpen(false);
    };

    const handleDelete = async () => {
        if (deleteMatch) {
            await deleteMatch(sequenceToDelete)
        }
    }

    // Update Modal
    // const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false)
    // const [sequenceToUpdate, setSequenceToUpdate] = useState<MatchSequenceDTO | null>(null)

    // const handleOpenUpdateModal = (sequence: MatchSequenceDTO) => {
    //     setSequenceToUpdate(sequence)
    //     setUpdateModalIsOpen(true)
    // }
    // const handleCloseUpdateModal = () => {
    //     setSequenceToUpdate(null)
    //     setUpdateModalIsOpen(false)
    // }

    return (
        <>
            {sequences.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ height: 400, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={sequences || []}
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
                                variant='subtitle2'>No sequences in this section.
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
                        By clicking yes you are going to delete this sequence permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* <UpdateMatch match={sequenceToUpdate} modalProp={{
                modalIsOpen: updateModalIsOpen,
                setModalIsOpen: handleCloseUpdateModal
            }} /> */}
        </>


    )
}

export default SequencesList