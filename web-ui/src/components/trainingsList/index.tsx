import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrainingDTO } from '../../DTOs/TrainingDTO';
import { useDeleteTrainingError, useDeletetraining } from '../../contexts/trainingsContext';

type PropType = {
    trainings: TrainingDTO[]
}

function TrainingsList({ trainings }: PropType) {
    const { t } = useTranslation();

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
                        to={`/trainings/${params.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>{params.row.date}</Typography>
                    </Link>
                );
            }
        },
        {
            field: 'category',
            headerName: `${t("category")}`,
            flex: 2,
            minWidth: 100,
            renderCell: (params) => {
                return (
                    <Link
                        component={RouterLink}
                        to={`/trainings/${params.id}`}
                        underline="none"
                        color="inherit">
                        <Typography>{params.row.category.id}</Typography>
                    </Link>
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
                        <IconButton title='Delete training' onClick={() => handleOpenDeleteDialog(params.row.id)}>
                            <MdDelete />
                        </IconButton>
                    </Box>
                );
            }
        }
    ];

    // Delete Dialog
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState<boolean>(false)
    const [trainingToDelete, setTrainingToDelete] = useState<string>("")

    const deleteTraining = useDeletetraining()
    const deleteTrainingError = useDeleteTrainingError()

    const handleOpenDeleteDialog = (trainingID: string) => {
        setTrainingToDelete(trainingID)
        setDeleteDialogIsOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setTrainingToDelete("")
        setDeleteDialogIsOpen(false);
    };

    const handleDelete = async () => {
        if (deleteTraining) {
            await deleteTraining(trainingToDelete)
        }
    }

    return (
        <>
            {trainings.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ height: 700, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={trainings || []}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
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
                                variant='subtitle2'>{t("no_trainings")}
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
                    {deleteTrainingError != "" ?
                        <Alert severity='error' sx={{ marginBottom: 1 }}>{deleteTrainingError}</Alert>
                        : <></>}
                    <DialogContentText id="alert-dialog-description">
                        {t("deleting_training_warning")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>{t("cancel")}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t("yes")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>


    )
}

export default TrainingsList