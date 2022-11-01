import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useUsers, useUsersReady } from '../contexts/usersContext';
import { UserDTO } from '../DTOs';
import Avatar from '@mui/material/Avatar';

const columns: GridColDef[] = [
    {
        field: 'profile_pic',
        headerName: 'Profile Pic',
        flex: 1,
        minWidth: 60,
        align: "center",
        renderCell: (params) => {
            return (
                <>
                    <Avatar src={params.value} sx={{ width: 32, height: 32 }} />
                </>
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

export default function UsersList() {
    const [rows, setRows] = useState<UserDTO[]>([])

    const usersReady = useUsersReady()
    const users = useUsers()

    useEffect(() => {
        if (usersReady && users) {
            setRows(users)
        }
    }, [usersReady, users])

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows || []}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    );
}
