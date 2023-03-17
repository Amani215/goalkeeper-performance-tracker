import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Link, Typography } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useState } from 'react';
import { GrowthDTO } from '../../DTOs/GrowthDTO';
import UpdateGrowth from '../../containers/modals/updateGrowth';
import { useDeleteGrowth, useDeleteGrowthError } from '../../contexts/growthContext';

type PropType = {
    growthList: GrowthDTO[]
}

function GrowthList({ growthList }: PropType) {
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
            headerName: 'Height',
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
            headerName: 'Weight',
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
            headerName: 'Torso Height',
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
            headerName: 'Thoracic Perimeter',
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
            headerName: 'Annual Growth',
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

    return (
        <>
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
                                variant='subtitle2'>No data in this section yet.
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
                    {deleteGrowthError != "" ?
                        <Alert severity='error' sx={{ marginBottom: 1 }}>{deleteGrowthError}</Alert>
                        : <></>}
                    <DialogContentText id="alert-dialog-description">
                        By clicking yes you are going to delete this growth object permanently.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <UpdateGrowth growth={growthToUpdate} modalProp={{
                modalIsOpen: updateModalIsOpen,
                setModalIsOpen: handleCloseUpdateModal
            }} />
        </>


    )
}

export default GrowthList