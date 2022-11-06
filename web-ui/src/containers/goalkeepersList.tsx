import Avatar from '@mui/material/Avatar';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';

const columns: GridColDef[] = [
    {
        field: 'picture',
        headerName: 'Picture',
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
        field: 'name',
        headerName: 'Name',
        flex: 3, minWidth: 100
    },
    {
        field: 'birthday',
        headerName: 'Age',
        flex: 1,
        minWidth: 60,
        align: "center",
    }
]

function GoalkeepersList() {
    const [rows, setRows] = useState<GoalkeeperDTO[]>([] as GoalkeeperDTO[])
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
    )
}

export default GoalkeepersList