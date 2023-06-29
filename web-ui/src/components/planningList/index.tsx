import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import { PlanningDTO } from '../../DTOs/PlanningDTO';
import { useTranslation } from 'react-i18next';
import { useDeletePlanning, useDeletePlanningError } from '../../contexts/planningContext';
import NewPlanning from '../../containers/modals/newPlanning';
import UpdatePlanning from '../../containers/modals/updatePlanning';

type PropType = {
    categoryID: string,
    planningList: PlanningDTO[]
}

function PlanningList({ categoryID, planningList }: PropType) {
    const { t } = useTranslation();

    // Columns
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: `${t("training")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.date}</Typography>
                );
            }
        },
        {
            field: 'type',
            headerName: `${t("planning_type")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.type}</Typography>
                );
            }
        },
        {
            field: 'techniques',
            headerName: `${t("techniques")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.techniques}</Typography>
                );
            }
        },
        {
            field: 'physiques',
            headerName: `${t("physiques")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.physiques}</Typography>
                );
            }
        },
        {
            field: 'psychomotricity',
            headerName: `${t("psychomotricity")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.psychomotricity}</Typography>
                );
            }
        },
        {
            field: 'tactics',
            headerName: `${t("tactics")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.tactics}</Typography>
                );
            }
        },
        {
            field: 'observation',
            headerName: `${t("observation")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.observation}</Typography>
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
                        <IconButton title='Edit' onClick={() => handleOpenUpdateModal(params.row)}>
                            <MdEdit />
                        </IconButton>
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
    const [planningToDelete, setPlanningToDelete] = useState<string>("")

    const deletePlanning = useDeletePlanning()
    const deletePlanningError = useDeletePlanningError()

    const handleOpenDeleteDialog = (planningID: string) => {
        setPlanningToDelete(planningID)
        setDeleteDialogIsOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setPlanningToDelete("")
        setDeleteDialogIsOpen(false);
    };

    const handleDelete = async () => {
        if (deletePlanning) {
            await deletePlanning(planningToDelete).then(() => setDeleteDialogIsOpen(false))
        }
    }

    // Update Modal
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false)
    const [planningToUpdate, setPlanningToUpdate] = useState<PlanningDTO | null>(null)

    const handleOpenUpdateModal = (planning: PlanningDTO) => {
        setPlanningToUpdate(planning)
        setUpdateModalIsOpen(true)
    }
    const handleCloseUpdateModal = () => {
        setPlanningToUpdate(null)
        setUpdateModalIsOpen(false)
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
                <Typography fontWeight="bold" mt={2} mb={1}>{t("planning")}</Typography>

                <Button
                    variant="contained"
                    onClick={() => { handleOpenAddModal() }}
                >{t("add")}
                </Button>
            </Box>

            {planningList.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ height: 400, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={planningList || []}
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
                    {deletePlanningError != "" ?
                        <Alert severity='error' sx={{ marginBottom: 1 }}>{deletePlanningError}</Alert>
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

            {/* UPDATE */}
            <UpdatePlanning planning={planningToUpdate} modalProp={{
                modalIsOpen: updateModalIsOpen,
                setModalIsOpen: handleCloseUpdateModal
            }} />

            {/* UPDATE */}
            <NewPlanning
                categoryID={categoryID} modalProp={{
                    modalIsOpen: addModalIsOpen,
                    setModalIsOpen: handleCloseAddModal
                }} />
        </>


    )
}

export default PlanningList