import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useUsers, useUsersReady } from '../contexts/usersContext';
import { UserDTO } from '../DTOs';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, minWidth: 100 },
    { field: 'username', headerName: 'Username', flex: 2, minWidth: 100 },
    { field: 'admin', headerName: 'Admin', flex: 1, minWidth: 80 },
    { field: 'profile_pic', headerName: 'Profile Pic', flex: 2, minWidth: 100 }
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
