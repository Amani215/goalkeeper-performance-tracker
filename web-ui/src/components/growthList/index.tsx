import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import { GrowthDTO } from '../../DTOs/GrowthDTO';
import UpdateGrowth from '../../containers/modals/updateGrowth';
import { useDeleteGrowth, useDeleteGrowthError } from '../../contexts/growthContext';
import NewGrowth from '../../containers/modals/newGrowth';
import { useTranslation } from 'react-i18next';

type PropType = {
    goalkeeperID: string,
    growthList: GrowthDTO[]
}

function GrowthList({ goalkeeperID, growthList }: PropType) {
    const { t } = useTranslation();

    // Columns
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
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
            field: 'height',
            headerName: `${t("height")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.height} cm</Typography>
                );
            }
        },
        {
            field: 'weight',
            headerName: `${t("weight")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.weight} kg</Typography>
                );
            }
        },
        {
            field: 'torso_height',
            headerName: `${t("torso_height")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.torso_height} cm</Typography>
                );
            }
        },
        {
            field: 'thoracic_perimeter',
            headerName: `${t("thoracic_perimeter")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.thoracic_perimeter} cm</Typography>
                );
            }
        },
        {
            field: 'annual_growth',
            headerName: `${t("annual_growth")}`,
            headerAlign: 'center',
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Typography>{params.row.annual_growth} cm</Typography>
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
    const [growthToDelete, setGrowthToDelete] = useState<string>("")

    const deleteGrowth = useDeleteGrowth()
    const deleteGrowthError = useDeleteGrowthError()

    const handleOpenDeleteDialog = (growthID: string) => {
        setGrowthToDelete(growthID)
        setDeleteDialogIsOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setGrowthToDelete("")
        setDeleteDialogIsOpen(false);
    };

    const handleDelete = async () => {
        if (deleteGrowth) {
            await deleteGrowth(growthToDelete).then(() => setDeleteDialogIsOpen(false))
        }
    }

    // Update Modal
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false)
    const [growthToUpdate, setGrowthToUpdate] = useState<GrowthDTO | null>(null)

    const handleOpenUpdateModal = (growth: GrowthDTO) => {
        setGrowthToUpdate(growth)
        setUpdateModalIsOpen(true)
    }
    const handleCloseUpdateModal = () => {
        setGrowthToUpdate(null)
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
                <Typography fontWeight="bold" mt={2} mb={1}>{t("growth")}</Typography>

                <Button
                    variant="contained"
                    onClick={() => { handleOpenAddModal() }}
                >{t("add")}
                </Button>
            </Box>

            {growthList.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ height: 400, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={growthList || []}
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
                    {deleteGrowthError != "" ?
                        <Alert severity='error' sx={{ marginBottom: 1 }}>{deleteGrowthError}</Alert>
                        : <></>}
                    <DialogContentText id="alert-dialog-description">
                        By clicking yes you are going to delete this growth object permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>{t("cancel")}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {t("yes")}
                    </Button>
                </DialogActions>
            </Dialog>

            <UpdateGrowth growth={growthToUpdate} modalProp={{
                modalIsOpen: updateModalIsOpen,
                setModalIsOpen: handleCloseUpdateModal
            }} />

            <NewGrowth
                goalkeeperID={goalkeeperID} modalProp={{
                    modalIsOpen: addModalIsOpen,
                    setModalIsOpen: handleCloseAddModal
                }} />
        </>


    )
}

export default GrowthList