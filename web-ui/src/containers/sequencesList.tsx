import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import { MatchSequenceDTO } from '../DTOs/MatchSequenceDTO';
import { useAddMatchSequences, useDeleteMatchSequence } from '../contexts/matchPerformanceContext';
import { useParams } from 'react-router-dom';
import UpdateSequence from './modals/updateSequence';
import { useTranslation } from 'react-i18next'

type PropType = {
    sequences: MatchSequenceDTO[]
}

function SequencesList({ sequences }: PropType) {
    const { t } = useTranslation();

    // Columns
    const columns: GridColDef[] = [
        {
            field: 'sequence_number',
            headerName: 'Num',
            flex: 1,
            minWidth: 10,
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
            headerName: `${t("result")}`,
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
            headerName: `${t("comment")}`,
            flex: 2,
            minWidth: 80,
            renderCell: (params) => {
                return (
                    <Typography>{params.row.comment}</Typography>
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
                        <IconButton title='Edit sequence' onClick={() => handleOpenUpdateModal(params.row)}>
                            <MdEdit />
                        </IconButton>
                        <IconButton title='Delete sequence' onClick={() => handleOpenDeleteDialog(params.row.id)}>
                            <MdDelete />
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    // Add Sequence
    const addSequence = useAddMatchSequences()
    const { id } = useParams();

    const add = () => {
        if (addSequence) {
            addSequence(id ? id : "")
        }
    }
    // Delete Dialog
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false)
    const [sequenceToDelete, setSequenceToDelete] = useState<string>("")

    const deleteSequence = useDeleteMatchSequence()

    const handleOpenDeleteDialog = (sequenceID: string) => {
        setSequenceToDelete(sequenceID)
        setDeleteDialogIsOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setSequenceToDelete("")
        setDeleteDialogIsOpen(false);
    };

    const handleDelete = async () => {
        if (deleteSequence) {
            await deleteSequence(sequenceToDelete).then(() => setDeleteDialogIsOpen(false))
        }
    }

    // Update Modal
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false)
    const [sequenceToUpdate, setSequenceToUpdate] = useState<MatchSequenceDTO | null>(null)

    const handleOpenUpdateModal = (sequence: MatchSequenceDTO) => {
        setSequenceToUpdate(sequence)
        setUpdateModalIsOpen(true)
    }
    const handleCloseUpdateModal = () => {
        setSequenceToUpdate(null)
        setUpdateModalIsOpen(false)
    }

    return (
        <>
            <Box
                display="flex" justifyContent="flex-end">
                <Button
                    variant='contained'
                    sx={{ marginBottom: 1, marginTop: 2 }}
                    onClick={() => { add() }}>{t("add_sequence")}</Button>
            </Box>
            {sequences.length > 0 ?
                <Box
                    display="flex"
                    flexDirection="column">
                    <div style={{ height: 400, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={sequences || []}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />
                    </div>
                </Box> :
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
                                variant='subtitle2'>{t("no_sequences")}
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
                    <DialogContentText id="alert-dialog-description">
                        {t("deleting_sequence_warning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>{t("cancel")}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t("yes")}
                    </Button>
                </DialogActions>
            </Dialog>

            <UpdateSequence sequence={sequenceToUpdate} modalProp={{
                modalIsOpen: updateModalIsOpen,
                setModalIsOpen: handleCloseUpdateModal
            }} />
        </>


    )
}

export default SequencesList