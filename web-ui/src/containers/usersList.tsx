import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useUsers, useUsersReady } from '../contexts/usersContext';
import { UserDTO } from '../DTOs';
import Avatar from '@mui/material/Avatar';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ModalProp } from '../interfaces/modalProp';

const columns: GridColDef[] = [
    {
        field: 'profile_pic',
        headerName: 'Profile Pic',
        flex: 1,
        minWidth: 60,
        align: "center",
        renderCell: (params) => {
            return (
                <RouterLink to={`/users/${params.id}`}>
                    <Avatar src={params.row.profile_pic} sx={{ width: 32, height: 32 }} />
                </RouterLink>
            );
        }
    },
    {
        field: 'id',
        headerName: 'ID',
        flex: 2,
        minWidth: 80
    },
    {
        field: 'username',
        headerName: 'Username',
        flex: 3, minWidth: 100
    },
    {
        field: 'admin',
        headerName: 'Admin',
        flex: 1,
        type: 'boolean',
        minWidth: 80
    }
];

export default function UsersList({
    setModalIsOpen
}: ModalProp) {
    const [rows, setRows] = useState<UserDTO[]>([])

    const usersReady = useUsersReady()
    const users = useUsers()

    useEffect(() => {
        if (usersReady && users) {
            setRows(users)
        }
    }, [usersReady, users])

    return (
        <>
            <Box
                display="flex" justifyContent="flex-end"
                mb={2}>
                <Button variant="contained" onClick={() => { setModalIsOpen() }}>Add User</Button>
            </Box>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows || []}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
        </>
    );
}
